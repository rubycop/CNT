import { CurrencyDollarIcon, UserIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NearContext } from "../../context/near";
import { Currency, PLATFORM_FEE } from "../../utils/utils";
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
    <div className="mb-2 text-sm font-semibold uppercase tracking-wider">
      {!loading && isIncomming(contest) && (
        <div className="flex flex-row justify-between">
          <div>Participants</div>
          <div>
            {participants?.length} / {contest.size}
          </div>
        </div>
      )}
      {isActive(contest) && (
        <div className="flex flex-row justify-between">
          <div>Total votes</div>
          <div>
            {participants
              .map((p) => p.votes_count)
              .reduce((prev, next) => prev + next, 0)}
          </div>
        </div>
      )}

      {!isIncomming(contest) && !isActive(contest) && contestWinner && (
        <>
          <div className="flex flex-row justify-between">
            <div>Total votes</div>
            <div>{contestWinner.votes_count}</div>
          </div>
          <div className="flex flex-row justify-between">
            <div>Winner</div>
            <div>{contest.winner_id}</div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-96 p-7 rounded-2xl bg-gray-900">
      <div className="relative w-full h-64">
        <img
          className="w-full h-full object-center object-cover rounded-xl"
          src={contest.image}
          alt=""
          onError={(error) =>
            (error.target.src = require("../../assets/template/images/left-infos.jpg"))
          }
        />
        <div className="z-10 bottom-5 right-5 lg:hidden absolute tracking-wider  px-3 py-1 text-xs font-semibold text-white">
          {isIncomming ? "Incoming" : isActive ? "Active" : ""}
        </div>
      </div>
      <div className="justify-between flex flex-col w-full">
        <div className="relative">
          <div className="mt-6 mb-5 w-full ">
            <h2 className="text-2xl mb-5 font-semibold line-clamp-2">
              {contest.title}
            </h2>

            <p>{contest.description}</p>
            <div className="mb-1 text-sm flex flex-row font-semibold uppercase tracking-wider  justify-between">
              <div>Prize pool</div>
              <div
                className="ml-2 flex items-center
                 text-green-500"
              >
                {participants?.length > 0 ? (
                  <>
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
            <div className="hidden lg:block mb-12">
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
  );
};
