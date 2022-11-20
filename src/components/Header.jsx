import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "../assets/styles/common.style";
import { login, logout } from "../utils/nearApi";
import { Button } from "./Button";

export const Header = ({ currentUser }) => {
  let navigate = useNavigate();

  const [reward, setReward] = useState("-");
  const [loading, isLoading] = useState(false);

  const getReward = async () => {
    isLoading(true);
    const _reward = await window.contract.get_voter_rewards({
      owner_id: currentUser.accountId,
    });
    setReward(_reward);
    isLoading(false);
  };

  useEffect(() => {
    getReward();
  }, []);

  return (
    <div className="sticky top-0 z-50 py-5 bg-violet-800">
      <Container>
        <Row className="justify-between">
          <Row>
            <a className="text-xl font-bold text-white" href="/">
              Beat My Nft
            </a>
          </Row>
          <Row>
            <button
              className="flex flex-row items-center font-medium text-white mx-5 hover:text-violet-300"
              onClick={() => navigate("/contests")}
            >
              Browse Contests
            </button>
            <button
              className="flex flex-row items-center font-medium text-white mx-5 hover:text-violet-300"
              onClick={() => navigate("/vote")}
            >
              Start Voting
            </button>
            <button
              className="flex flex-row items-center font-medium text-white mx-5 hover:text-violet-300"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </button>
          </Row>
          {currentUser ? (
            <div className="flex flex-row items-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-3 mr-10 text-white">
                {currentUser.accountId}
              </div>
              <div className="ml-3 mr-10 font-semibold text-green-300">
                {reward} BMT
              </div>

              <Button
                title="Logout"
                icon={<LogoutIcon className="ml-3 h-5 w-5" />}
                handleClick={logout}
                outlined
              />
            </div>
          ) : (
            <Button
              title="Connect wallet"
              icon={<LoginIcon className="ml-3 h-5 w-5" />}
              handleClick={login}
              outlined
            />
          )}
        </Row>
      </Container>
    </div>
  );
};
