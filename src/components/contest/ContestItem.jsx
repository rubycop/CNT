import { CurrencyDollarIcon, UserIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NearContext } from "../../context/near";
import {
  Currency,
  isActive,
  isIncomming,
  PLATFORM_FEE,
  TrophyIcon,
} from "../../utils/utils";
import { Button } from "../Button";
import { ProgressBar } from "../ProgressBar";
import { Timer } from "../Timer";
import { JoinContestModal } from "./JoinContestModal";

export const ContestItem = ({ contest, small }) => {
  const near = useContext(NearContext);
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, isLoading] = useState(false);

  const fetchParticipants = async () => {
    isLoading(true);
    const participants = await near.mainContract.getContestParticipants({
      contest_id: contest.id,
    });

    setParticipants(participants);
    isLoading(false);
  };

  const participated = () =>
    near.isSigned &&
    participants?.filter((p) => p.owner_id === near.wallet.accountId)?.length >
      0;

  const winners = participants.filter((p) => contest.winner_ids.includes(p.id));

  const contestId = (contest) => (
    <a href={`https://explorer.testnet.near.org/transactions/${contest.id}`}>
      ID-{contest.id.slice(contest.id.length - 5, contest.id.length)}
    </a>
  );

  const getPrizePool = (
    participants?.length *
    contest.entry_fee *
    (1 - PLATFORM_FEE)
  ).toFixed(2);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const Participants = ({ contest }) => (
    <div className="mb-2 font-semibold uppercase tracking-wider">
      {!loading && isIncomming(contest) && (
        <div className="flex mb-2 flex-row justify-between">
          <div>Participants</div>
          <div>
            {participants?.length} / {contest.size}
          </div>
        </div>
      )}
      {isActive(contest) && (
        <>
          <div className="flex mb-2 flex-row justify-between">
            <div>Participants</div>
            <div>
              {participants?.length} / {contest.size}
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div>Total votes</div>
            <div>
              {participants
                .map((p) => p.votes_count)
                .reduce((prev, next) => prev + next, 0)}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className={`hover:border-violet-700 hover:shadow-lg hover:shadow-violet-500/50 flex flex-col ${
        small ? "w-full lg:w-[22rem]" : "w-full lg:w-[30rem]"
      } p-7 rounded-2xl bg-gray-900 border border-solid border-violet-300/20`}
    >
      {winners.length > 0 && (
        <div className="absolute z-30 m-3">
          <TrophyIcon styles="w-7 h-7" />
        </div>
      )}
      <div className={`relative w-full ${small ? "h-48" : "h-60"}`}>
        <img
          className="w-full h-full object-center object-cover rounded-xl"
          src={contest.image}
          alt=""
          onError={(error) =>
            (error.target.src = require("../../assets/images/public_contest.jpeg"))
          }
        />
        <div className="z-10 bottom-5 right-5 lg:hidden absolute tracking-wider  px-3 py-1 text-xs font-semibold text-white">
          {isIncomming ? "Incoming" : isActive ? "Active" : ""}
        </div>
      </div>
      <div className="justify-between flex flex-col w-full flex-1">
        <div className="relative">
          <div className="mt-6 w-full text-sm relative">
            <h2 className="text-2xl mb-5 font-semibold line-clamp-1">
              {contest.title}
            </h2>

            <div className="z-30 p-2 px-5 absolute -top-11 text-base -right-2 bg-gray-900 rounded-xl flex flex-row font-semibold tracking-wider justify-between">
              <div
                className="flex items-center
                 text-green-500"
              >
                {participants?.length > 0 ? (
                  <>
                    <TrophyIcon styles="w-5 h-5 mr-2" onlyIcon />
                    <div>{getPrizePool}</div>
                    <Currency contest={contest} />
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>

            <Participants contest={contest} />
          </div>

          {(isIncomming(contest) || isActive(contest)) && (
            <div className="hidden lg:block mt-5">
              <div className="mb-2">
                <Timer contest={contest} />
              </div>
              <ProgressBar
                time={
                  isActive
                    ? parseInt(contest.end_time)
                    : parseInt(contest.start_time)
                }
              />
            </div>
          )}
        </div>

        <div className="flex-col mt-10 items-end justify-center w-full">
          {isIncomming(contest) &&
          !participated() &&
          participants?.length < contest.size ? (
            <div className="mb-5">
              <Button
                full
                disabled={!near.isSigned}
                title={
                  <>
                    Join for {contest.entry_fee}
                    <Currency contest={contest} />
                  </>
                }
                handleClick={() => near.isSigned && setShowJoinModal(true)}
              />

              <JoinContestModal
                showModal={showJoinModal}
                setShowModal={setShowJoinModal}
                contest={contest}
              />
            </div>
          ) : isIncomming(contest) && participated() ? (
            <div className="mb-5">
              <Button full disabled title="Joined" handleClick={() => {}} />
            </div>
          ) : (
            <></>
          )}
          <div
            className="text-center w-full text-violet-300/40 hover:text-violet-300 cursor-pointer"
            onClick={(e) => {
              navigate(`/contest/${contest.id}`);
            }}
          >
            View Contest
          </div>
        </div>
      </div>
    </div>
  );
};
