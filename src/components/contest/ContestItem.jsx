import { CurrencyDollarIcon, UserIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { Timer } from "../Timer";

export const isIncomming = (contest) =>
  new Date(contest.start_time) > new Date();

export const isActive = (contest) =>
  new Date(contest.start_time) < new Date() &&
  new Date(contest.end_time) > new Date();

export const ContestItem = ({ contest, currentUser, index, handleJoin }) => {
  const [participants, setParticipants] = useState([]);
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
    participants.filter((p) => p.owner_id === currentUser.accountId)?.length >
    0;

  useEffect(() => {
    getContestParticipants();
  }, []);

  return (
    <div className="flex flex-row w-full bg-gray-50 mb-2">
      <img
        className="w-40 h-40 object-cover"
        src="https://media.istockphoto.com/id/1297349747/photo/hot-air-balloons-flying-over-the-botan-canyon-in-turkey.jpg?b=1&s=170667a&w=0&k=20&c=1oQ2rt0FfJFhOcOgJ8hoaXA5gY4225BA4RdOP1RRBz4="
      />
      <div className="flex flex-col p-3 ml-2 w-full">
        <div>
          <div>
            <span className="text-xs font-medium leading-none text-gray-400">
              <a
                href={`https://explorer.testnet.near.org/transactions/${contest.id}`}
              >
                ID-{contest.id.slice(contest.id.length - 5, contest.id.length)}
              </a>
            </span>
            <span className="pl-2 ml-2 border-l-2 text-xs text-gray-400">
              {contest.owner_id}
            </span>
          </div>
        </div>
        <div>
          <div className="text-xl mt-2 font-semibold">{contest.title}</div>
        </div>

        <div className="mt-2 rounded-full border-2 border-gray-300 py-1 px-2 w-fit">
          <Timer contest={contest} />
        </div>

        <div
          className={`flex flex-col text-sm gap-y-1 leading-none mt-3`}
        >
          {!loading &&
            isIncomming(contest) &&
            `Available:  ${participants?.length} / ${contest.size}`}
          {isActive(contest) &&
            participants
              .sort((a, b) => b.votes_count - a.votes_count)
              .map((p, i) => (
                <div key={i}>
                  <div
                    className={`${
                      p.votes_count > 0 ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {p.owner_id} - {p.votes_count} votes
                  </div>
                </div>
              ))}
          {!isIncomming(contest) &&
            !isActive(contest) &&
            participants
              .sort((a, b) => b.votes_count - a.votes_count)
              .map((p, i) => (
                <div key={i}>
                  <div
                    className={`${
                      p.votes_count > 0 ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {p.owner_id} - {p.votes_count} votes
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className="flex items-center justify-end mr-5">
        {isIncomming(contest) && !participated() && (
          <Button
            title={`Join for ${contest.entry_fee} NEAR`}
            handleClick={() => handleJoin(contest.id)}
          />
        )}
      </div>
    </div>
  );
};
