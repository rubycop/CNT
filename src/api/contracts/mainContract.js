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
      console.log(`blockchain error`, e);
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
      console.log(`blockchain error`, e);
    }
  }

  async getContests() {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_participants",
      });
    } catch (e) {
      console.log(`blockchain error`, e);
    }
  }

  async getParticipants() {
    try {
      return await this.wallet.viewMethod({
        contractId: this.contractId,
        method: "get_participants",
      });
    } catch (e) {
      console.log(`blockchain error`, e);
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
      console.log(`blockchain error`, e);
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
      console.log(`blockchain error`, e);
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
      console.log(`blockchain error`, e);
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
      console.log(`blockchain error`, e);
    }
  }

  async vote(args) {
    const gas = convertToTera(30);
    try {
      return await this.wallet.callMethod({
        contractId: this.contractId,
        method: "vote",
        args,
        gas,
      });
    } catch (e) {
      console.log(`blockchain error`, e);
    }
  }
  // const deposit = utils.format.parseNearAmount(depositNEAR.toString());
}
