import { PlusIcon, ThumbUpIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Skeleton } from "../../components/Skeleton";

export const Vote = ({ currentUser }) => {
  const [loading, isLoading] = useState(false);
  const [contest, setContest] = useState();
  const [participants, setParticipants] = useState([]);

  const vote = async (participant) => {
    isLoading(true);
    await window.contract.vote({
      contest_id: contest.id,
      participant_id: participant.id,
      reward:
        participants.sort((a, b) => b.voted_count - a.voted_count)[0] ===
        participant
          ? "15"
          : "10",
    });
    isLoading(false);
  };

  const getContest = async () => {
    isLoading(true);

    const contests = await window.contract.get_contests({});
    const activeContests = [contests[3]].filter(
      (c) =>
        new Date(c.start_time) < new Date() && new Date(c.end_time) > new Date()
    );

    setContest(
      activeContests[Math.floor(Math.random() * activeContests.length)]
    );
    isLoading(false);
  };

  const getContestParticipants = async () => {
    isLoading(true);
    const _participants = await window.contract.get_contest_participants({
      contest_id: contest.id,
    });

    setParticipants(_participants);
    isLoading(false);
  };

  useEffect(() => {
    getContest();
  }, []);

  useEffect(() => {
    if (contest) getContestParticipants();
  }, [contest]);

  if (loading)
    return (
      <>
        <Header currentUser={currentUser} />
        <Skeleton />
      </>
    );
  if (!contest || participants.length === 0)
    return (
      <>
        <Header currentUser={currentUser} />
        <div className="justify-center items-center flex h-screen">
          <div className="text-4xl font-bold text-center w-64">
            There is no contest to vote
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header currentUser={currentUser} />
      <Wrapper>
        <div className="flex w-full justify-center items-center">
          <div className="flex flex-col h-screen w-1/2 justify-center items-center gap-x-3">
            <div className="text-4xl font-semibold mb-16">{contest.title}</div>
            <div className="flex flex-row gap-x-5">
              {participants.map((p, i) => (
                <div key={i}>
                  <img
                    src={p.nft_src}
                    className={`rounded-md object-cover w-60 h-90 ${
                      i === 0 ? "-rotate-12" : "rotate-12"
                    } hover:border-2 hover:border-green-500 hover:p-1`}
                  />
                  <div className="w-full mt-10">
                    <Button
                      title="Vote"
                      icon={<ThumbUpIcon className="ml-3 h-5 w-5" />}
                      handleClick={() => vote(p)}
                      full
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
