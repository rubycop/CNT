use near_sdk::{AccountId, Balance, env, near_bindgen, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_contract_standards::non_fungible_token::TokenId;

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
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            contests: vec![],
            participants: vec![],
            voters: vec![],
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

    fn to_yocto(&self, tokens: f64) -> Balance {
        let amount = tokens * 10u128.pow(24) as f64;
        amount.to_string().parse().unwrap()
    }

    #[payable]
    pub fn join_contest(&mut self, contest_id: String, nft_src: String) -> Promise {
        let contest = self.get_contest_by_id(contest_id.clone()).unwrap();
        let participants = self.get_contest_participants(contest_id.clone());
        let deposit = env::attached_deposit();
        let platform_fee = deposit * 0.01 as u128;

        if deposit != self.to_yocto(contest.entry_fee.parse::<f64>().unwrap()) {
            env::panic_str("Wrong amount of attached deposit value");
        }

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
    
        Promise::new(env::current_account_id()).transfer(platform_fee);
        Promise::new(contest.owner_id).transfer(deposit - platform_fee)
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
