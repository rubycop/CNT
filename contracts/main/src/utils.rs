use crate::*;

impl Contract {
    // Generate random u8 number (0-254)
    pub(crate) fn random_u8(&self, index: usize) -> u8 {
        *env::random_seed().get(index).unwrap()
    }

    // Convert f64 to yocto NEAR Balance
    pub(crate) fn convert_to_yocto(value: &str) -> Balance {
        let values: Vec<_> = value.split('.').collect();
        let part1 = values[0].parse::<u128>().unwrap() * 10u128.pow(24);
        if values.len() > 1 {
            let power = values[1].len() as u32;
            let part2 = values[1].parse::<u128>().unwrap() * 10u128.pow(24 - power);
            part1 + part2
        } else {
            part1
        }
    }

    // Convert u64 to yocto NEAR Gas
    pub(crate) fn convert_to_tera(tokens: u64) -> Gas {
        (tokens * 10u128.pow(12) as u64).into()
    }

    pub(crate) fn assert_contract_owner(&self, owner_id: AccountId) {
        if env::predecessor_account_id() != owner_id {
            env::panic_str("You can't call this method: wrong predecessor_account_id!");
        }
    }
}
