import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { MainContract } from "./api/contracts/mainContract";
import { Wallet } from "./utils/near-wallets";
import { NearProvider } from "./context/near";
import "../src/assets/styles/index.css";
import { NotificationProvider } from "./context/notification";
import { AccountProvider } from "./context/account";

window.onload = async () => {
  console.log(process.env.CONTRACT_NAME);

  const wallet = new Wallet({
    createAccessKeyFor: process.env.CONTRACT_NAME,
    network: process.env.NETWORK,
  });

  const mainContract = new MainContract({
    contractId: process.env.CONTRACT_NAME,
    parasContractId: process.env.PARAS_TOKEN_CONTRACT,
    wallet: wallet,
  });

  const isSigned = await wallet.startUp();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <NotificationProvider>
      <NearProvider
        wallet={wallet}
        isSignedInit={isSigned}
        mainContract={mainContract}
      >
        <AccountProvider>
          <App />
        </AccountProvider>
      </NearProvider>
    </NotificationProvider>
  );
};
