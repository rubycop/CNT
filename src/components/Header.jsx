import {
  ArrowUpIcon,
  CheckCircleIcon,
  LoginIcon,
  LogoutIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Row } from "../assets/styles/common.style";
import { Button } from "./Button";
import logo from "../assets/images/logo.png";
import { NearContext } from "../context/near";
import { convertFromYocto, formatNumber, getLevel } from "../utils/utils";
import { BellIcon, ChartBarIcon, DatabaseIcon } from "@heroicons/react/outline";
import { AccountContext } from "../context/account";
import { UpgradeModal } from "./contest/UpgradeModal";

export const Header = ({ dark }) => {
  const near = useContext(NearContext);
  const { reward, setReward, xp, setXP } = useContext(AccountContext);

  const [loading, isLoading] = useState(false);
  const [small, setSmall] = useState(false);
  const [show, setShow] = useState(false);
  const [toggleAccount, setToggleAccount] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getReward = async () => {
    isLoading(true);

    const resp = await near.mainContract.ftBalanceOf();
    const respXP = await near.mainContract.getAccountXP();

    setReward(convertFromYocto(resp));
    setXP(respXP);
    isLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setSmall(dark || window.pageYOffset > 100)
      );
    }
  }, []);

  useEffect(() => {
    if (dark) setSmall(dark);
  }, []);

  useEffect(() => {
    if (near.wallet.accountId) getReward();
  }, [near.wallet.accountId]);

  return (
    <nav
      id="header"
      className={`fixed w-full z-30 top-0 py-2 text-white ${
        (small || show) &&
        "backdrop-filter backdrop-blur-sm bg-gray-900/90 shadow-lg"
      }`}
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <div className="pl-4 flex items-center">
          <a href="/">
            <img className="h-10" src={logo} />
          </a>
        </div>
        <div className="block lg:hidden pr-4">
          <button
            id="nav-toggle"
            onClick={() => setShow(!show)}
            className="flex items-center p-1 hover:text-white-600 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            <svg
              className="fill-current h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          className={`w-full flex-grow lg:flex lg:items-center lg:w-auto my-3 lg:my-0 lg:bg-transparent text-white p-4 lg:p-0 z-20  ${
            show
              ? "flex flex-col justify-center items-center shadow-lg gap-y-7 text-black"
              : "hidden"
          }`}
          id="nav-content"
        >
          <ul
            className={`list-reset lg:flex justify-center gap-x-10 flex-1 items-center ${
              show && "text-center text-white flex flex-col gap-y-7"
            }`}
          >
            <li>
              <a
                className="tracking-widest hover:text-violet-200"
                href="/contests"
              >
                Browse Contests
              </a>
            </li>
            <li>
              <a className="tracking-widest hover:text-violet-200" href="/vote">
                Vote
              </a>
            </li>
            <li>
              <a
                className="tracking-widest hover:text-violet-200"
                href="/leaderboard"
              >
                Leaderboard
              </a>
            </li>
          </ul>
          <Button
            full={show}
            title="Try Testnet app"
            icon={<LoginIcon className="ml-3 h-5 w-5" />}
            handleClick={() => window.location.replace("test.contesty.app")}
            white
          />
        </div>
      </div>
    </nav>
  );
};
