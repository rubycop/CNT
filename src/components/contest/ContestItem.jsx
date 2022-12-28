import { CurrencyDollarIcon, UserIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
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

export const ContestItem = ({ contest, currentUser, handleJoin }) => {
  const [participants, setParticipants] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, isLoading] = useState(false);

  const getContestParticipants = async () => {
    isLoading(true);
    const participants = await window.contract.get_contest_participants({
      contest_id: contest.id,
    });

    setParticipants(participants);
    isLoading(false);
  };

  const participated = () =>
    currentUser &&
    participants.filter((p) => p.owner_id === currentUser.accountId)?.length >
      0;

  const contestId = (contest) => (
    <a href={`https://explorer.testnet.near.org/transactions/${contest.id}`}>
      ID-{contest.id.slice(contest.id.length - 5, contest.id.length)}
    </a>
  );

  const contestWinner = participants.sort(
    (a, b) => b.votes_count - a.votes_count
  )[0];

  const getPrizePool =
    participants.length * contest.entry_fee * (1 - PLATFORM_FEE);

  useEffect(() => {
    getContestParticipants();
  }, []);

  const Participants = ({ contest }) => (
    <>
      {!loading &&
        isIncomming(contest) &&
        `Available:  ${participants?.length} / ${contest.size}`}
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
    </>
  );

  return (
    <div className="main-content w-full lg:w-[45%] shadow-lg">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-1/3 h-64 lg:h-full">
          <img
            className="w-full h-full object-center object-cover"
            src={contest.image}
            alt=""
            onError={(error) =>
              (error.target.src = require("../../assets/template/images/left-infos.jpg"))
            }
          />
        </div>
        <div className="w-full lg:w-2/3 p-10 h-full">
          <div className="mb-10">
            <h2 className="text-4xl leading-snug font-normal w-full mb-5">
              {contest.title}
            </h2>
            <div className="font-bold text-base mb-5 text-gray-600">
              Prize pool:
              <span className="ml-2 text-green-500">
                {participants?.length > 0
                  ? `${getPrizePool} ${currency(contest)}`
                  : "-"}
              </span>
            </div>
            <div className="line-dec"></div>
            <p>{contest.description}</p>
            <p>
              <Participants contest={contest} />
            </p>
          </div>

          {isIncomming(contest) ||
            (isActive(contest) && (
              <>
                <Timer contest={contest} />
                <ProgressBar
                  time={
                    isActive
                      ? parseInt(contest.end_time)
                      : parseInt(contest.start_time)
                  }
                />
              </>
            ))}

          <div className="flex items-center justify-end mt-16 mr-5">
            {isIncomming(contest) && !participated() && (
              <>
                <Button
                  full
                  disabled={!currentUser}
                  title={`Join for ${contest.entry_fee} ${currency(contest)}`}
                  handleClick={() => currentUser && setShowJoinModal(true)}
                />

                <JoinContestModal
                  showModal={showJoinModal}
                  setShowModal={setShowJoinModal}
                  currentUser={currentUser}
                  contest={contest}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
