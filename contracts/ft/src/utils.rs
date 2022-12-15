use near_sdk::{env, Timestamp, AccountId};
use uint::construct_uint;

pub const ONE_TOKEN: u128 = 1_000_000_000_000_000_000_000_000;

construct_uint! {
    /// 256-bit unsigned integer.
    pub struct U256(4);
}

pub fn nano_to_sec(nano: Timestamp) -> u128 {
    (nano / 1_000_000_000) as u128
}

pub fn assert_parent_contract() -> AccountId {
    // Get and validate parent contract ID
    let current_contract = env::current_account_id().to_string();
    let (_, main_contract) = current_contract.split_once(".").unwrap();
    let main_contract = main_contract.parse().unwrap();

    // check mint caller
    if env::predecessor_account_id() != main_contract {
        panic!("You can't mint NFT directly");
    }

    main_contract
}
