use crate::*;

impl Contract {
    pub(crate) fn add_token_storage(&mut self, account_id: &AccountId) {
        let ft_mint_deposit: Balance = Contract::convert_to_yocto("0.00125");
        let ft_mint_gas: Gas = Contract::convert_to_tera(10);

        Promise::new(self.contract_ft.clone()).function_call(
            "ft_mint".to_string(),
            json!({
            "receiver_id": account_id,
            "amount": "0"
        }).to_string().as_bytes().to_vec(),
            ft_mint_deposit,
            ft_mint_gas,
        );

        self.ft_storage_accounts.insert(account_id);
    }
}
