import { PlusIcon, ThumbUpIcon } from "@heroicons/react/solid";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Wrapper } from "../../assets/styles/common.style";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Skeleton } from "../../components/Skeleton";
import { NearContext } from "../../context/near";

export const Vote = () => {
  const near = useContext(NearContext);

  const [loading, isLoading] = useState(false);
  const [contest, setContest] = useState();
  const [participants, setParticipants] = useState([]);
  const [defaultImg, setDefaultImg] = useState(false);

  const vote = async (participant) => {
    isLoading(true);
    await near.mainContract.vote({
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

    const contests = await near.mainContract.getContests();
    const activeContests = contests.filter(
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
    const _participants = await near.mainContract.getContestParticipants({
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
        <Header />
        <Skeleton />
      </>
    );
  // if (!contest || participants.length < 2)
  //   return (
  //     <>
  //       <Header />
  //       <div className="justify-center items-center flex h-screen">
  //         <div className="text-4xl font-bold text-center w-64">
  //           There is no contest to vote
  //         </div>
  //       </div>
  //     </>
  //   );

  return (
    <>
      <Header dark />
      <div className="bg-white h-screen">
        <Wrapper>
          <div className="flex w-full justify-center items-center">
            <div className="flex flex-col h-screen w-1/2 justify-center items-center gap-x-3">
              <div className="text-4xl font-semibold mb-16">
                {contest.title}
              </div>
              <div className="flex flex-row gap-x-5">
                {participants.map((p, i) => (
                  <div key={i}>
                    <div
                      className={`w-72 h-90 border-2 rounded-3xl ${
                        i === 0 ? "-rotate-12" : "rotate-12"
                      } hover:border-2 hover:border-green-500 hover:p-1`}
                      key={i}
                    >
                      <img
                        className={`w-72 h-90 bg-cover rounded-3xl`}
                        src={defaultImg || `https://ipfs.io/ipfs/${p.nft_src}`}
                        onError={() =>
                          setDefaultImg(
                            "https://media.tenor.com/xnZaQ3O98dMAAAAM/thinking-processing.gif"
                          )
                        }
                      />
                      {defaultImg && (
                        <div className="absolute top-5 w-full text-center text-sm">
                          Image is processing on IPFS
                        </div>
                      )}
                    </div>
                    <div className="w-full px-20 mt-16">
                      <Button
                        title="+1"
                        icon={<ThumbUpIcon className="ml-3 h-5 w-5" />}
                        handleClick={() => vote(p)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};
