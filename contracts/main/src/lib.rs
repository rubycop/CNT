use near_contract_standards::non_fungible_token::TokenId;
// use near_sdk::assert_one_yocto;
use near_sdk::collections::{LookupMap};
use near_sdk::{AccountId, Balance, BorshStorageKey, env, Gas, near_bindgen, Promise, serde_json::json, ext_contract};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

mod utils;

pub const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000 as u128;
pub const XCC_GAS: Gas = Gas(30_000_000_000_000);

pub const PLATFORM_FEE: f64 = 0.05;
pub const REWARD_VOTE_CNT: usize = 3;

pub const XP_JOIN_CNT: u32 = 10;
pub const XP_JOIN_NEAR: u32 = 25;
pub const XP_PREDICT: u32 = 15;
pub const XP_WIN: u32 = 50;
pub const XP_REWARD_MAP: [u32; 6] = [3,4,5,7,10,15];

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    FtStorageAccounts,
    PredictStorageAccounts
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Participant {
    pub id: String,
    pub owner_id: AccountId,
    pub contest_id: String,
    pub token_id: String,
    pub nft_src: String,
    pub votes_count: u8,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Voter {
    pub owner_id: String,
    pub contest_id: String,
    pub participant_id: String,
    pub reward: u32,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Prediction {
    pub owner_id: String,
    pub participant_id: String,
    pub amount: u128,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Contest {
    pub id: String,
    pub owner_id: AccountId,
    pub image: String,
    pub title: String,
    pub size: usize,
    pub entry_fee: String,
    pub currency_ft: bool,
    pub start_time: String,
    pub end_time: String,
    pub winner_ids: Vec<String>
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    contests: Vec<Contest>,
    participants: Vec<Participant>,
    voters: Vec<Voter>,
    predictions: Vec<Prediction>,
    contract_ft: AccountId,
    accounts: LookupMap<AccountId, u32>,
}


#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn callback_join_contest(
        #[callback] token_id: String
    ) -> String;
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            contests: vec![],
            participants: vec![],
            voters: vec![],
            predictions: vec![],
            contract_ft: format!("ft.{}", env::current_account_id()).try_into().unwrap(),
            accounts: LookupMap::new(StorageKeys::FtStorageAccounts)
        }
    }
}

impl Clone for Contest {
    fn clone(&self) -> Self {
        Contest {
            id: self.id.clone(),
            owner_id: self.owner_id.clone(),
            title: self.title.clone(),
            size: self.size.clone(),
            image: self.image.clone(),
            entry_fee: self.entry_fee.clone(),
            currency_ft: self.currency_ft.clone(),
            start_time: self.start_time.clone(),
            end_time: self.end_time.clone(),
            winner_ids: self.winner_ids.clone(),
        }
    }
}

impl Clone for Voter {
    fn clone(&self) -> Self {
        Voter {
            owner_id: self.owner_id.clone(),
            contest_id: self.contest_id.clone(),
            participant_id: self.participant_id.clone(),
            reward: self.reward.clone(),
        }
    }
}

impl Clone for Prediction {
    fn clone(&self) -> Self {
        Prediction {
            owner_id: self.owner_id.clone(),
            participant_id: self.participant_id.clone(),
            amount: self.amount.clone(),
        }
    }
}

impl Clone for Participant {
    fn clone(&self) -> Self {
        Participant {
            id: self.id.clone(),
            owner_id: self.owner_id.clone(),
            contest_id: self.contest_id.clone(),
            token_id: self.token_id.clone(),
            nft_src: self.nft_src.clone(),
            votes_count: self.votes_count.clone()
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn get_contests(&self) -> Vec<Contest> {
        self.contests.clone()
    }

    pub fn get_full_contests(&self) -> Vec<Contest> {
        self.get_contests()
            .into_iter()
            .filter(|c| self.get_contest_participants(&c.id).len() > 1)
            .collect()
    }

    pub fn get_participants(&self) -> Vec<Participant> {
        self.participants.clone()
    }

    pub fn get_voters(&self) -> Vec<Voter> {
        self.voters.clone()
    }

    pub fn get_predictions(&self) -> Vec<Prediction> {
        self.predictions.clone()
    }

    pub fn get_account_xp(&self, account_id: AccountId) -> u32 {
        self.accounts.get(&account_id).unwrap_or(0)
    }

    pub fn get_contest_by_id(&self, contest_id: &String) -> Option<Contest> {
        self.get_contests()
            .into_iter()
            .find(|c| &c.id == contest_id)
    }

    pub fn get_participant_by_id(&self, participant_id: &String) -> Option<Participant> {
        self.get_participants()
            .into_iter()
            .find(|c| &c.id == participant_id)
    }

    pub fn get_voter_by_contest_id(&self, voter_id: &String, contest_id: &String) -> Option<Voter> {
        self.get_voters()
            .into_iter()
            .find(|c| &c.contest_id == contest_id && &c.owner_id == voter_id)
    }

    pub fn get_contest_voters(&self, contest_id: &String) -> Vec<Voter> {
        self.get_voters()
            .into_iter()
            .filter(|v| &v.contest_id == contest_id)
            .collect()
    }

    pub fn get_contest_participants(&self, contest_id: &String) -> Vec<Participant> {
        self.get_participants()
            .into_iter()
            .filter(|p| &p.contest_id == contest_id)
            .collect()
    }

    pub fn get_voter_rewards(&self, owner_id: String) -> u32 {
        self.get_voters()
            .into_iter()
            .filter(|v| v.owner_id == owner_id)
            .map(|v| v.reward)
            .sum()
    }

    pub fn get_predictions_by_participant_id(&self, participant_id: &String) -> Vec<Prediction> {
        self.get_predictions()
            .into_iter()
            .filter(|v| &v.participant_id == participant_id)
            .collect()
    }

    pub fn add_token_storage(&mut self, account_id: &AccountId) {
        let ft_mint_deposit: Balance = Contract::convert_to_yocto("0.00125");
        let ft_mint_gas: Gas = Contract::convert_to_tera(10);

        let account = match self.accounts.get(&account_id) {
            Some(_xp) => true,
            None => false
        };

        if !account {
            Promise::new(self.contract_ft.clone()).function_call(
                "ft_mint".to_string(),
                json!({
                "receiver_id": account_id,
                "amount": "0"
            }).to_string().as_bytes().to_vec(),
                ft_mint_deposit,
                ft_mint_gas,
            );

            self.accounts.insert(account_id, &0);
        }
    }

    #[private]
    pub fn add_xp(&mut self, account_id: AccountId, xp_type: u32) -> () {
        let mut xp = self.get_account_xp(account_id.clone());
        xp += xp_type;

        self.accounts.insert(&account_id, &xp);
    }

    #[private]
    pub fn add_voting_xp(&mut self, account_id: AccountId) -> u32 {
        let mut xp = self.get_account_xp(account_id.clone());
        let earned_xp = match xp {
            0..=29 => XP_REWARD_MAP[0],
            30..=49 => XP_REWARD_MAP[1],
            50..=119 => XP_REWARD_MAP[2],
            120..=249 => XP_REWARD_MAP[3],
            250..=599 => XP_REWARD_MAP[4],
            _ => XP_REWARD_MAP[5],
        };
        xp += earned_xp;

        self.accounts.insert(&account_id, &xp);
        earned_xp
    }

    pub fn create_contest(&mut self,
            title: String,
            size: String,
            entry_fee: String,
            start_time: String,
            image: String,
            end_time: String,
            currency_ft: bool
        ) -> String {
        let xp = self.get_account_xp(env::predecessor_account_id());

        if xp < 120 {
            env::panic_str("Reach 4 Level (120 XP) to create contest");
        }
        
        let id = env::block_timestamp();
        let new_contest = Contest {
            id: id.to_string(),
            owner_id: env::predecessor_account_id(),
            title: title.to_string(),
            entry_fee: entry_fee.to_string(),
            image: image.to_string(),
            size: size.parse().unwrap_or(1),
            currency_ft: currency_ft,
            start_time: start_time.to_string(),
            end_time: end_time.to_string(),
            winner_ids: vec![]
        };

        self.contests.push(new_contest.clone());
        id.to_string()
    }

    #[payable]
    pub fn join_contest(&mut self, contest_id: String, token_id: String, nft_src: String) -> () {
        let contest = self.get_contest_by_id(&contest_id)
                                   .expect("[JOIN]: There is no contest with such id");
        let transfer_amount: u128 = contest.entry_fee.parse::<u128>().unwrap() * u128::from(ONE_NEAR);
        let sender_id = env::predecessor_account_id();

        if !contest.currency_ft {
            if env::attached_deposit() != transfer_amount {
                env::panic_str("Attached amount does not match entry fee");
            }

            Promise::new(env::current_account_id()).transfer(transfer_amount).then(
                Self::ext(env::current_account_id())
                    .with_static_gas(Contract::convert_to_tera(30))
                    .callback_join_contest(
                        contest_id.clone(),
                        sender_id,
                        token_id.to_string(),
                        nft_src.to_string()
                    )
            );
        }
    }

    #[payable]
    pub fn update_level(&mut self) -> () {
        let account_id = env::predecessor_account_id();
        let transfer_amount: u128 = env::attached_deposit();
        
        let mut xp = self.get_account_xp(env::predecessor_account_id());
        xp += 10 * (transfer_amount / u128::from(ONE_NEAR)) as u32;

        Promise::new(env::current_account_id()).transfer(transfer_amount).then(
            Self::ext(env::current_account_id())
                .with_static_gas(Contract::convert_to_tera(30))
                .callback_update_level(account_id.clone(), xp.clone())
        );
        
    }

    pub fn callback_update_level(&mut self, account_id: AccountId, xp: u32) -> () {
        self.accounts.insert(&account_id, &xp);
    }

    pub fn callback_join_contest(&mut self, contest_id: String, owner_id: AccountId, token_id: String, nft_src: String) -> () {
        let mut sender_id = env::predecessor_account_id();
        let contest = self.get_contest_by_id(&contest_id)
                                   .expect("[CALLBACK JOIN]: There is no contest with such id");
        if contest.currency_ft {
            self.add_token_storage(&sender_id);
        } else {
            sender_id = owner_id;
        }

        let participants = self.get_contest_participants(&contest_id);
        let xp_type= if contest.currency_ft { XP_JOIN_CNT } else { XP_JOIN_NEAR };

        if contest.size == participants.len() {
            env::panic_str("There is no free space in this contest");
        }

        let participant = Participant {
            id: env::block_timestamp().to_string(),
            contest_id: contest_id,
            owner_id: sender_id,
            token_id: token_id.to_string(),
            nft_src: nft_src.to_string(),
            votes_count: 0
        };

        self.participants.push(participant.clone());
        self.add_xp(participant.id.try_into().unwrap(), xp_type);
    }

    pub fn callback_predict_contest(&mut self, participant_id: String, owner_id: AccountId, amount: String) -> Prediction {
        if env::predecessor_account_id() != owner_id {
            env::panic_str("You can't perform that action");
        }

        self.get_participant_by_id(&participant_id)
            .expect("[PREDICT]: There is no participant with such id");

        let prediction = Prediction {
            participant_id: participant_id.clone(),
            amount: amount.parse().unwrap_or(0),
            owner_id: owner_id.to_string()
        };
        
        self.predictions.push(prediction.clone());
        self.add_xp(participant_id.try_into().unwrap(), XP_PREDICT);

        prediction
    }

    #[payable]
    pub fn vote(&mut self, participant_id: String, contest_id: String) -> [u32; 2] {
        let voter_id: AccountId = env::predecessor_account_id();

        match self.get_voter_by_contest_id(&voter_id.to_string(), &contest_id) {
            Some(_v) => env::panic_str("[VOTE]: You already voted in contest"),
            None => true
        };

        let mut participant = self.get_participant_by_id(&participant_id)
                                               .expect("[VOTE]: There is no participant with such id");
        
        self.add_token_storage(&voter_id);

        let reward = REWARD_VOTE_CNT as u32;
        let transfer_amount: u128 = u128::from(reward) * u128::from(ONE_NEAR);
        let xp = self.add_voting_xp(voter_id.clone());

        participant.votes_count += 1;
        let index = self.participants
                               .iter()
                               .position(|x| &x.id == &participant_id)
                               .expect("[VOTE]: There is no participant in participants list");
        self.participants.remove(index);
        self.participants.push(participant);

        let new_voter = Voter {
            contest_id: contest_id,
            participant_id: participant_id,
            owner_id: voter_id.to_string(),
            reward: reward
        };

        Promise::new(self.contract_ft.clone()).function_call(
            "ft_transfer".to_string(),
            json!({
                "receiver_id": voter_id,
                "amount": transfer_amount.to_string(),
            }).to_string().as_bytes().to_vec(),
            1,
            Contract::convert_to_tera(20),
        );

        self.voters.push(new_voter);

        return [reward, xp];
    }

    #[payable]
    pub fn set_winner(&mut self, contest_id: String) -> Contest {
        let mut contest = self.get_contest_by_id(&contest_id)
                                       .expect("[WINNER]: There is no contest with such id");
        let winner = self.get_contest_participants(&contest_id)
                                      .iter()
                                      .max_by_key(|p| p.votes_count)
                                      .unwrap()
                                      .clone();

        let winners: Vec<Participant> = self.get_contest_participants(&contest_id)
                                          .iter()
                                          .filter(|p| p.votes_count == winner.votes_count)
                                          .map(|p| p.clone())
                                          .collect();
        let winner_ids: Vec<String> = winners.iter().map(|p| p.id.to_string()).collect();

        contest.winner_ids = winner_ids.clone();

        let participants_size = self.get_contest_participants(&contest_id).len() as u128;
        let reward = (contest.entry_fee.parse::<u128>().unwrap() * participants_size) as f64;
        let fee = reward * PLATFORM_FEE;
        let transfer_amount: u128 = ((reward - fee) as f64 / winner_ids.clone().len() as f64) as u128 * u128::from(ONE_NEAR);
        
        let index = self.contests.iter()
                                        .position(|x| x.id == contest_id.clone())
                                        .unwrap();

        for p in winners {
            let acc_id: AccountId = p.owner_id.try_into().unwrap();

            if contest.currency_ft == true {
                self.add_xp(acc_id.clone(), XP_WIN);
                self.add_token_storage(&acc_id);

                if reward > 0.0 {
                    Promise::new(self.contract_ft.clone()).function_call(
                        "ft_transfer".to_string(),
                        json!({
                            "receiver_id": acc_id,
                            "amount": transfer_amount.to_string(),
                        }).to_string().as_bytes().to_vec(),
                        1,
                        Contract::convert_to_tera(20),
                    );
                }
            } else {
                if reward > 0.0 {
                    Promise::new(acc_id).transfer(transfer_amount);
                }
            }
        }
        self.contests.remove(index);
        self.contests.push(contest.clone());

        contest
    }
}
