import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "../assets/styles/common.style";
import { login, logout } from "../utils/nearApi";
import { Button } from "./Button";
import logo from "../assets/images/logo.png";

export const Header = ({ currentUser }) => {
  let navigate = useNavigate();

  const [reward, setReward] = useState("-");
  const [loading, isLoading] = useState(false);

  const getReward = async () => {
    isLoading(true);
    const _reward = await window.ftContract?.ft_balance_of({
      account_id: currentUser.accountId,
    });
    setReward(_reward);
    isLoading(false);
  };

  useEffect(() => {
    if (currentUser) getReward();
  }, [currentUser]);

  return (
    <div className="top-0 z-50 py-5 text-white">
      <Container>
        <Row className="justify-between">
          <Row className="">
            <a href="/">
              <img className="h-10" src={logo} />
            </a>
          </Row>
          <Row className="font-regular text-base justify-around gap-x-10">
            <a className="tracking-widest" href="/contests">
              Browse Contests
            </a>
            <a className="tracking-widest" href="/vote">
              Vote
            </a>
            <a className="tracking-widest" href="/leaderboard">
              Leaderboard
            </a>
          </Row>
          {currentUser ? (
            <Row className="items-center ">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-3 mr-10 text-base tracking-widest truncate w-32">
                {currentUser.accountId}
              </div>
              <div className="ml-3 mr-10 font-semibold text-green-400 text-base tracking-widest">
                {reward} CNT
              </div>

              <Button
                title="Logout"
                icon={<LogoutIcon className="ml-3 h-5 w-5" />}
                handleClick={logout}
                outlined
                white
              />
            </Row>
          ) : (
            <Button
              title="Connect wallet"
              icon={<LoginIcon className="ml-3 h-5 w-5" />}
              handleClick={login}
              white
            />
          )}
        </Row>
      </Container>
    </div>
  );
};
