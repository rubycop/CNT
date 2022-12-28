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
use near_sdk::serde_json::json;
use near_sdk::{AccountId, Balance, env, log, near_bindgen, PanicOnDefault, Promise, PromiseOrValue, BorshStorageKey, Gas};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap};
use near_sdk::json_types::{U128};

mod helpers;

const FT_IMAGE_ICON: &str = "data:image/png;base64,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";
#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Token,
    TokeBalance
}
#[derive(BorshDeserialize, BorshSerialize)]
pub struct OldContract {
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
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
                name: "Contesty".to_string(),
                symbol: "CNT".to_string(),
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

    #[payable]
    pub fn ft_mint(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
    ) {
        //get initial storage usage
        assert_eq!(amount.0, 0, "Cannot mint tokens, just 0 for approve");

        let initial_storage_usage = env::storage_usage();

        if !self.token.accounts.contains_key(&receiver_id) {
            self.token.accounts.insert(&receiver_id, &0);
        }

        //refund any excess storage
        let storage_used = env::storage_usage() - initial_storage_usage;
        let required_cost = env::storage_byte_cost() * Balance::from(storage_used);
        let attached_deposit = env::attached_deposit();

        assert!(
            required_cost <= attached_deposit,
            "Must attach {} yoctoNEAR to cover storage", required_cost
        );

        let refund = attached_deposit - required_cost;
        if refund > 1 {
            Promise::new(env::predecessor_account_id()).transfer(refund);
        }
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
