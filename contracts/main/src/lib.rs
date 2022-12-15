
use std::fmt;

use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::{AccountId, assert_one_yocto, Balance, BorshStorageKey, env, Gas, near_bindgen, Promise, serde_json::json, ext_contract, Timestamp};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, LookupSet, UnorderedMap};
use near_sdk::json_types::{U128, U64};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json::Value as JsonValue;

mod utils;

pub const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000 as u128;
pub const XCC_GAS: Gas = Gas(30_000_000_000_000);

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Participant {
    pub id: String,
    pub owner_id: AccountId,
    pub contest_id: String,
    pub nft_src: TokenId,
    pub votes_count: u8
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Voter {
    pub owner_id: String,
    pub contest_id: String,
    pub participant_id: String,
    pub reward: u8,
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
    pub start_time: String,
    pub end_time: String,
    pub winner_id: Option<String>
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    contests: Vec<Contest>,
    participants: Vec<Participant>,
    voters: Vec<Voter>,
    contract_ft: AccountId
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
            contract_ft: format!("ft.{}", env::current_account_id()).try_into().unwrap(),
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
            start_time: self.start_time.clone(),
            end_time: self.end_time.clone(),
            winner_id: self.winner_id.clone(),
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

impl Clone for Participant {
    fn clone(&self) -> Self {
        Participant {
            id: self.id.clone(),
            owner_id: self.owner_id.clone(),
            contest_id: self.contest_id.clone(),
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

    pub fn get_participants(&self) -> Vec<Participant> {
        self.participants.clone()
    }

    pub fn get_voters(&self) -> Vec<Voter> {
        self.voters.clone()
    }

    pub fn get_contest_by_id(&self, contest_id: String) -> Option<Contest> {
        self.get_contests()
            .into_iter()
            .find(|c| c.id == contest_id)
    }

    pub fn get_participant_by_id(&self, participant_id: String) -> Option<Participant> {
        self.get_participants()
            .into_iter()
            .find(|c| c.id == participant_id)
    }

    pub fn get_contest_participants(&self, contest_id: String) -> Vec<Participant> {
        self.get_participants()
            .into_iter()
            .filter(|p| p.contest_id == contest_id)
            .collect()
    }

    pub fn get_voter_rewards(&self, owner_id: String) -> u8 {
        self.get_voters()
            .into_iter()
            .filter(|v| v.owner_id == owner_id)
            .map(|v| v.reward)
            .sum()
    }

    pub fn create_contest(&mut self,
            title: String,
            size: String,
            entry_fee: String,
            start_time: String,
            image: String,
            end_time: String
        ) -> Vec<Contest> {
        let new_contest = Contest {
            id: env::block_timestamp().to_string(),
            owner_id: env::predecessor_account_id(),
            title: title.to_string(),
            entry_fee: entry_fee.to_string(),
            image: image.to_string(),
            size: size.parse().unwrap_or(1),
            start_time: start_time.to_string(),
            end_time: end_time.to_string(),
            winner_id: None
        };

        self.contests.push(new_contest);
        self.contests.clone()
    }

    #[payable]
    pub fn join_contest(&mut self, contest_id: String, nft_src: String, amount: String) -> Promise {
        let ft_amount_transfer = u128::from(amount) * ONE_NEAR;

        Promise::new(self.contract_ft.clone()).function_call(
            "ft_transfer".to_string(),
            json!({
                "receiver_id": env::current_account_id().to_string(),
                "amount": ft_amount_transfer.to_string()
            }).to_string().as_bytes().to_vec(),
            1,
            Contract::convert_to_tera(10),
        ).then(
            Self::ext(env::current_account_id())
                .with_static_gas(Contract::convert_to_tera(50))
                .callback_join_contest(
                    contest_id.clone(),
                    nft_src.to_string(),
                )
        );
    }

    pub fn callback_join_contest(&mut self, contest_id: String, nft_src: String) -> Participant {
        let contest = self.get_contest_by_id(contest_id.clone()).unwrap();
        let participants = self.get_contest_participants(contest_id.clone());

        if contest.size == participants.len() {
            env::panic_str("There is no free space in this contest");
        }

        let participant = Participant {
            id: env::block_timestamp().to_string(),
            contest_id: contest_id,
            owner_id: env::predecessor_account_id(),
            nft_src: nft_src.to_string(),
            votes_count: 0
        };

        self.participants.push(participant);
        participant
    }

    pub fn vote(&mut self, participant_id: String, contest_id: String, reward: String) -> Vec<Voter> {
        let mut participant = self.get_participant_by_id(participant_id.clone()).unwrap();
        participant.votes_count += 1;
        let index = self.participants
                               .iter()
                               .position(|x| x.id == participant_id.clone())
                               .unwrap();
        self.participants.remove(index);
        self.participants.push(participant);

        let voter = Voter {
            contest_id: contest_id,
            participant_id: participant_id,
            owner_id: env::predecessor_account_id().to_string(),
            reward: reward.parse().unwrap_or(0)
        };

        self.voters.push(voter);
        self.voters.clone()
    }

    pub fn set_winner(&mut self, contest_id: String) -> Contest {
        let mut contest = self.get_contest_by_id(contest_id.clone()).unwrap();
        let winner_participant = self.get_contest_participants(contest_id.clone())
                                                    .iter()
                                                    .max_by_key(|p| p.votes_count)
                                                    .unwrap()
                                                    .clone();

        contest.winner_id = Some(winner_participant.id);

        let index = self.contests.iter()
                                        .position(|x| x.id == contest_id.clone())
                                        .unwrap();
        self.contests.remove(index);
        self.contests.push(contest.clone());

        contest
    }
}
