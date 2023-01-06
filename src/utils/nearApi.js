import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { getConfig } from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

export async function initContract() {
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  window.walletConnection = new WalletConnection(near);
  window.accountId = window.walletConnection.getAccountId();

  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        "get_contests",
        "get_participants",
        "get_contest_participants",
        "get_voter_rewards",
        "nft_tokens_for_owner",
      ],
      changeMethods: ["create_contest", "join_contest", "vote"],
    }
  );

  window.ftContract = await new Contract(
    window.walletConnection.account(),
    `ft.${nearConfig.contractName}`,
    {
      viewMethods: ["ft_balance_of"],
      changeMethods: ["ft_mint", "ft_transfer", "ft_transfer_call"],
    }
  );

  window.parasContract = await new Contract(
    window.walletConnection.account(),
    `${process.env.PARAS_TOKEN_CONTRACT}`,
    {
      viewMethods: [
        "nft_tokens_for_owner",
        "nft_get_series_single",
        "nft_supply_for_series",
      ],
      changeMethods: ["nft_transfer", "nft_approve"],
    }
  );
}
