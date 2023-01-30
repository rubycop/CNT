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
          {near.isSigned ? (
            <div className="relative">
              <div
                className="items-center flex hover:cursor-pointer hover:text-violet-200"
                onClick={() => setToggleAccount(!toggleAccount)}
              >
                <div>
                  <div className="absolute animate-ping w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="ml-3 mr-5 text-base tracking-widest truncate w-52">
                  {near.wallet.accountId}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
              </div>
              <Col
                className={`${
                  !toggleAccount && "hidden"
                } w-full lg:w-72 border border-solid border-violet-300/20 absolute rounded-xl p-5 items-center gap-3 shadow-lg bg-gray-900 mt-5`}
              >
                <div className="text-lg flex ">
                  <UserCircleIcon className="w-7 h-7" />
                  <span className="ml-3 text-base tracking-wider truncate w-52">
                    {near.wallet.accountId}
                  </span>
                </div>
                <div className="text-xs mb-3 flex gap-2">
                  <div className="bg-blue-500 p-1 flex items-center px-3 rounded-full text-white ">
                    <CheckCircleIcon className="h-3 w-3 mr-2" />
                    Verified
                  </div>
                  <div className="bg-pink-600 p-1 flex items-center px-3 rounded-full text-white ">
                    Creator
                  </div>
                </div>
                <div className="w-full">
                  <div className="p-5 rounded-lg bg-black/40 flex  flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <div>Earned</div>
                      <div className="text-green-500">
                        {formatNumber(reward)} CNT
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>Level {getLevel(xp)}</div>
                      <div>{formatNumber(xp)} XP</div>
                    </div>
                    <div className="mt-1">
                      <div className="w-full">
                        <Button
                          full
                          secondary
                          small
                          handleClick={() => setShowUpgradeModal(true)}
                          title="Upgrade Level"
                          icon={<ArrowUpIcon className="ml-2 w-4 h-4" />}
                        />
                      </div>
                      <UpgradeModal
                        showModal={showUpgradeModal}
                        setShowModal={setShowUpgradeModal}
                      />
                    </div>
                  </div>
                  <a
                    className="flex mt-7 mb-5 ml-2 hover:cursor-pointer hover:text-violet-200"
                    href="/"
                  >
                    <BellIcon className="w-5 h-5 mr-3" />
                    <span className="text-base">Notifications</span>
                  </a>
                  <a
                    className="flex my-7 ml-2 hover:cursor-pointer hover:text-violet-200"
                    href="/"
                  >
                    <ChartBarIcon className="w-5 h-5 mr-3" />
                    <span className="text-base">Statistic</span>
                  </a>
                  <a
                    className="flex mt-7 mb-5 ml-2 hover:cursor-pointer hover:text-violet-200"
                    href="/"
                  >
                    <DatabaseIcon className="w-5 h-5 mr-3" />
                    <span className="text-base">History</span>
                  </a>
                </div>
                <Button
                  full
                  title="Logout"
                  icon={<LogoutIcon className="ml-3 h-5 w-5" />}
                  handleClick={() => near.wallet.signOut()}
                  outlined
                  white
                />
              </Col>
            </div>
          ) : (
            <Button
              full={show}
              title="Connect wallet"
              icon={<LoginIcon className="ml-3 h-5 w-5" />}
              handleClick={() => near.wallet.signIn()}
              white
            />
          )}
        </div>
      </div>
    </nav>
  );
};
