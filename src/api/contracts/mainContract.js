import { utils } from "near-api-js";
import { convertToTera } from "../../utils/utils";

export class MainContract {
  constructor({ contractId, wallet, parasContractId }) {
    this.contractId = contractId;
    this.ftContractId = `ft.${contractId}`;
    this.parasContractId = parasContractId;
    this.wallet = wallet;
  }

  async ftBalanceOf(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.ftContractId,
        method: "ft_balance_of",
        args: {
          account_id: this.wallet.accountId,
        },
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getAccountXP() {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_account_xp",
        args: {
          account_id: this.wallet.accountId,
        },
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getContests() {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_contests",
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getFullContests() {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_full_contests",
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getContestById(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_contest_by_id",
        args,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getParticipants() {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_participants",
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getContestParticipants(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_contest_participants",
        args,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getContestVotes(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_contest_voters",
        args,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async nftToken(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.parasContractId,
        method: "nft_token",
        args,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async nftTokensForOwner(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.parasContractId,
        method: "nft_tokens_for_owner",
        args,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async createContest(args) {
    const gas = convertToTera(30);
    try {
      return await this.wallet.callMethod({
        contractId: this.contractId,
        method: "create_contest",
        args,
        gas,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async joinContest(args, gas, deposit) {
    try {
      return await this.wallet.callMethod({
        contractId: this.contractId,
        method: "join_contest",
        args,
        gas,
        deposit,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async getPredictionsByParticipantId(args) {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_predictions_by_participant_id",
        args,
      });
    } catch (e) {
      return { error: e };
    }
  }

  async vote(args) {
    const gas = convertToTera(50);
    try {
      return await this.wallet.callMethod({
        contractId: this.contractId,
        method: "vote",
        args,
        gas,
      });
    } catch (e) {
      return { error: e };
    }
  }
  // const deposit = utils.format.parseNearAmount(depositNEAR.toString());
}
