import { CurrencyDollarIcon, UserIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NearContext } from "../../context/near";
import { currency, PLATFORM_FEE } from "../../utils/utils";
import { Button } from "../Button";
import { ProgressBar } from "../ProgressBar";
import { Timer } from "../Timer";
import { JoinContestModal } from "./JoinContestModal";

export const isIncomming = (contest) =>
  new Date(parseInt(contest.start_time)) > new Date();

export const isActive = (contest) =>
  new Date(parseInt(contest.start_time)) < new Date() &&
  new Date(parseInt(contest.end_time)) > new Date();

export const ContestItem = ({ contest, handleJoin }) => {
  const near = useContext(NearContext);

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

  const contestId = (contest) => (
    <a href={`https://explorer.testnet.near.org/transactions/${contest.id}`}>
      ID-{contest.id.slice(contest.id.length - 5, contest.id.length)}
    </a>
  );

  const contestWinner = participants?.sort(
    (a, b) => b.votes_count - a.votes_count
  )[0];

  const getPrizePool =
    participants?.length * contest.entry_fee * (1 - PLATFORM_FEE);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const Participants = ({ contest }) => (
    <div className="font-semibold text-sm uppercase tracking-wider">
      {!loading &&
        isIncomming(contest) &&
        `participants:  ${participants?.length} / ${contest.size}`}
      {isActive(contest) && (
        <div>
          Total votes:{" "}
          {participants
            .map((p) => p.votes_count)
            .reduce((prev, next) => prev + next, 0)}
        </div>
      )}
      {!isIncomming(contest) && !isActive(contest) && contestWinner && (
        <div>
          {contest.winner_id} - {contestWinner.votes_count} votes
        </div>
      )}
    </div>
  );

  return (
    <div className="main-content w-full max-w-md shadow-lg ">
      <div className="flex flex-col lg:flex-row h-96">
        <div className="relative w-full lg:w-2/5 h-1/2 lg:h-full">
          <img
            className="w-full h-full object-center object-cover"
            src={contest.image}
            alt=""
            onError={(error) =>
              (error.target.src = require("../../assets/template/images/left-infos.jpg"))
            }
          />
          <div className="uppercase shadow-md z-10 bottom-5 right-5 lg:hidden absolute tracking-widest bg-violet-700 rounded px-3 py-1 text-xs font-semibold text-white">
            {isIncomming ? "Incoming" : isActive ? "Active" : ""}
          </div>
          <div className="block lg:hidden absolute top-0 w-full h-full opacity-80 bg-violet-900 flex justify-center items-center text-4xl text-white font-semibold">
            <Timer contest={contest} />
          </div>
          {(isIncomming(contest) || isActive(contest)) && (
            <div className="block lg:hidden">
              <ProgressBar
                plain
                time={
                  isActive
                    ? parseInt(contest.end_time)
                    : parseInt(contest.start_time)
                }
              />
            </div>
          )}
        </div>
        <div className="justify-between flex flex-col w-full lg:w-3/5 p-7">
          <div className="relative">
            <div className="mb-5">
              <h2 className="text-3xl leading-snug font-semibold w-full line-clamp-2">
                {contest.title}
              </h2>
              <div className="h-0.5 w-12 bg-black my-5"></div>
              <div className="text-sm mb-2 text-gray-800 font-semibold uppercase tracking-wider">
                Prize pool:
                <span className="ml-2 text-green-500">
                  {participants?.length > 0
                    ? `${getPrizePool} ${currency(contest)}`
                    : "-"}
                </span>
              </div>
              <p>{contest.description}</p>
              <p>
                <Participants contest={contest} />
              </p>
            </div>

            {(isIncomming(contest) || isActive(contest)) && (
              <div className="hidden lg:block">
                <Timer contest={contest} />
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

          <div className="flex iteems-end justify-center w-full">
            {isIncomming(contest) && !participated() ? (
              <>
                <Button
                  full
                  disabled={!near.isSigned}
                  title={`Join for ${contest.entry_fee} ${currency(contest)}`}
                  handleClick={() => near.isSigned && setShowJoinModal(true)}
                />

                <JoinContestModal
                  showModal={showJoinModal}
                  setShowModal={setShowJoinModal}
                  currentUser={near.isSigned}
                  contest={contest}
                />
              </>
            ) : (
              <Button full disabled title="Joined" handleClick={() => {}} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
