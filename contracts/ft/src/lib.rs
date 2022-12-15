/*!
Fungible Token implementation with JSON serialization.
NOTES:
  - The maximum balance value is limited by U128 (2**128 - 1).
  - JSON calls should pass U128 as a base-10 string. E.g. "100".
  - The contract optimizes the inner trie structure by hashing account IDs. It will prevent some
    abuse of deep tries. Shouldn't be an issue, once NEAR clients implement full hashing of keys.
  - The contract tracks the change in storage before and after the call. If the storage increases,
    the contract requires the caller of the contract to attach enough deposit to the function call
    to cover the storage cost.
    This is done to prevent a denial of service attack on the contract by taking all available storage.
    If the storage decreases, the contract will issue a refund for the cost of the released storage.
    The unused tokens from the attached deposit are also refunded, so it's safe to
    attach more deposit than required.
  - To prevent the deployed contract from being modified or deleted, it should not have any access
    keys on its account.
 */

use near_contract_standards::fungible_token::metadata::{
    FT_METADATA_SPEC, FungibleTokenMetadata, FungibleTokenMetadataProvider,
};
use near_contract_standards::fungible_token::FungibleToken;
use near_sdk::{AccountId, Balance, env, log, near_bindgen, PanicOnDefault, Promise, PromiseOrValue, BorshStorageKey};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap};
use near_sdk::json_types::{U128};

const FT_IMAGE_ICON: &str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAJ1BMVEUAAADuw0fNfR3quUHShyPgpDXlsDvXkSn126/cmy/xyH7wxVzxu1mK0HLnAAAAAXRSTlMAQObYZgAAA2dJREFUSMd1VT1PG0EQJUqDnBS8nO/OBpocZ58oFxtFlD4TUEobAUp5hECNFROlM0qDEho7X0oHSoNCA0oTUYU6fypvZ3d9Bw4PIdmet2/ezOzH1B0cHw+m7sX0xa8GAHV9D+cDxjj/X/wjAO/15pctBaAyGf8BBNtpRMT9DN7sxPorLEtYKBvA79vxErAiofVVoX0CTm8R/sLnz+vMTx9v+HGIuWItJwi48FDBYJ9SWTHJ9BW6IuvAdDVgUBCocj0KeBZFB6gUBHpcoRG8/OqBoGKSuygh1DkJOolX17dAqykl/ljCGUZRW//4NjVt2JMklLAZWGKsdCMjiw0QaTScM714jB0RWIoc+prRjOqYMRlIzmSJRRpv87sXxTATUb6UEJoobXrp80wKGUorStQ+ALBjDIZRwh9eZXrFggzkAUaSoWcISGsoi6QXLaIiFqJEvhpkuzVU428AuFBpEzc+pYCqI3iL8GM/UyyLJnQXysaCI+AzgiRoiYkWBuKx4ywQHewiqKOtO8dOnLJN3VjlXaBaMwueog+CfmdI6CXICVxUPgzaMC4TEh4ilZocIVGh8to0AlCbdb73uCgvgrVX4dXxDmKcdZ4FUmWYE3x4NbyAjC/ThHyU9RFTIIDXwhoANqAzp/vUcoQWa41J8DvegSXAEcpSohA8JgmEEBYIVSGMZLtTI2zdVfAi1jkkrQ2N5kZOYBWuUZ2AKkJg3Jp0ZYLq5Kf813oKtsy5qSM2Sr4YAudi4Rp1hHTROKYH+AkcXKsf2mH5Mkl8LxIYqehxR0rKkAoagIKkUXbcbsPQnz2gms0/s2EuueVCStsyasjhthw7RaLblCJhCxHpgZw8cVneNzY9yWG3vT7fR/bg+L5sOBdW44PzCE3msnWQ6iBH79JcD6S6bVm3HvLDS5fomYVp3LPDhJyKGGBYm1gy8+rVnkTK+LMXSEUIJXsFYbTgH9r1krAjFiSHucS60rCxQIL58UsRiv2dTh4P0sJNWmJ6XcjKeAxKLtL8wj/Te3YNBezrps4WX4uuu6zzy1wEnIR0qa/ssOU5cAJOQk8i2WoADfegUCDHCWWpwavcPUmuhDwJlnvFR212cOfVvWFu9ywqYN7Fi88SKXubm3tiVeKTDAd5ayYZ48f752TQUS6A6/Nby/8BNBAG258AcBEAAAAASUVORK5CYII=";

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Token,
    UserRewardPerTokenPaid,
    Rewards,
    Balances,
    StakeMonsterPct,
    ZmlReserved,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct OldContract {
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
    owner_id: AccountId,
    user_reward_per_token_paid: LookupMap<AccountId, u128>,
    rewards: LookupMap<AccountId, u128>,
    balances: LookupMap<AccountId, u128>,
    stake_monster_pct: LookupMap<AccountId, u8>,
    zml_reserved: LookupMap<AccountId, Balance>,
    total_supply: u128,
    last_update_time: u64,
    reward_per_token_stored: u128,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId, total_supply: U128) -> Self {
        Self::new(
            owner_id,
            total_supply,
            FungibleTokenMetadata {
                spec: FT_METADATA_SPEC.to_string(),
                name: "BMT token".to_string(),
                symbol: "BMT".to_string(),
                icon: Some(FT_IMAGE_ICON.to_string()),
                reference: None,
                reference_hash: None,
                decimals: 24,
            },
        )
    }

    #[init]
    pub fn new(
        owner_id: AccountId,
        total_supply: U128,
        metadata: FungibleTokenMetadata,
    ) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        let mut this = Self {
            token: FungibleToken::new(b"a".to_vec()),
            metadata: LazyOption::new(b"m".to_vec(), Some(&metadata)),
        };
        this.token.internal_register_account(&owner_id);
        this.token.internal_deposit(&owner_id, total_supply.into());
        near_contract_standards::fungible_token::events::FtMint {
            owner_id: &owner_id,
            amount: &total_supply,
            memo: Some("Initial tokens supply is minted"),
        }
        .emit();
        this
    }

    fn on_account_closed(&mut self, account_id: AccountId, balance: Balance) {
        log!("Closed @{} with {}", account_id, balance);
    }

    fn on_tokens_burned(&mut self, account_id: AccountId, amount: Balance) {
        log!("Account @{} burned {}", account_id, amount);
    }
}

near_contract_standards::impl_fungible_token_core!(Contract, token, on_tokens_burned);
near_contract_standards::impl_fungible_token_storage!(Contract, token, on_account_closed);

#[near_bindgen]
impl FungibleTokenMetadataProvider for Contract {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        self.metadata.get().unwrap()
    }
}
