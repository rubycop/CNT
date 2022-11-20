import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Contest, Home, Leaderboard, Vote } from "./pages";
import { CONTRACT_NAME } from "./utils/config";
import { initContract } from "./utils/nearApi";

export const App = () => {
  const [currentUser, setCurrentUser] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const updateUserBalance = async () => {
    const accountId = window.walletConnection?.getAccountId();

    if (accountId) {
      setCurrentUser({
        accountId: accountId,
        amount: "",
      });
    }
  };

  useEffect(() => {
    window.nearInitPromise = initContract()
      .then(async () => {
        if (window.walletConnection.isSignedIn()) {
          await updateUserBalance();
        }
        setIsReady(true);
      })
      .catch(console.error);
  }, []);

  console.log(CONTRACT_NAME);

  return (
    <BrowserRouter>
      {isReady && (
        <Routes>
          <Route exact path="/" element={<Home currentUser={currentUser} />} />
          <Route
            exact
            path="/contests"
            element={<Contest currentUser={currentUser} />}
          />
          <Route
            exact
            path="/vote"
            element={<Vote currentUser={currentUser} />}
          />
          <Route
            exact
            path="/leaderboard"
            element={<Leaderboard currentUser={currentUser} />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
};
