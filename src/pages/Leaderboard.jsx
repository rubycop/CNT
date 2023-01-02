import { ThumbUpIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import { Container, Wrapper } from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Skeleton } from "../components/Skeleton";
import { groupBy } from "../utils/utils";

export const Leaderboard = ({ currentUser }) => {
  const [loading, isLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [defaultImg, setDefaultImg] = useState(false);

  const getParticipants = async () => {
    isLoading(true);
    const _participants = await window.contract.get_participants({});
    const groupedByVotes = groupBy(_participants, (p) => p.owner_id);
    const arr = [];

    for (const [key, value] of groupedByVotes) {
      arr.push({
        accountId: key,
        count: value.reduce((prev, curr) => prev + curr.votes_count, 0),
      });
    }
    setParticipants(arr);
    setNFTs(_participants);
    isLoading(false);
  };

  useEffect(() => {
    getParticipants();
  }, []);

  // if (loading)
  //   return (
  //     <>
  //       <Header currentUser={currentUser} />
  //       <Skeleton />
  //     </>
  //   );

  return (
    <>
      <Header currentUser={currentUser} dark />
      <div className="bg-white h-screen">
        <div className="flex justify-center items-center w-full h-full text-3xl font-bold">
          Coming soon
        </div>
      </div>
      {/* <Wrapper>
        <Container className="pt-20 flex justify-center">
          <div className="w-1/2">
            <div className="pb-5 text-lg font-bold">Creators Leaderboard</div>
            {participants
              .sort((a, b) => b.count - a.count)
              .map((p, i) => (
                <div
                  className="w-full border mb-2 flex flex-row justify-between items-center
                   p-3 rounded-lg"
                  key={i}
                >
                  <div className="font-semibold text-base text-gray-700">
                    {p.accountId}
                  </div>
                  <div className="flex flex-row">
                    {p.count}
                    <ThumbUpIcon className="ml-3 h-5 w-5 fill-blue-500" />
                  </div>
                </div>
              ))}
          </div>
        </Container>
        <Container className="pt-20 flex justify-center">
          <div className="w-1/2">
            <div className="pb-5 text-lg font-bold">NFTs Leaderboard</div>
            {nfts
              .sort((a, b) => b.votes_count - a.votes_count)
              .map((p, i) => (
                <div
                  className="w-full border mb-2 flex flex-row justify-between items-center
                   p-3 rounded-lg"
                  key={i}
                >
                  <div className="font-semibold text-base text-gray-700">
                    <img
                      className="w-12"
                      src={defaultImg || `https://ipfs.io/ipfs/${p.nft_src}`}
                      onError={() =>
                        setDefaultImg(
                          "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-row">
                    {p.votes_count}
                    <ThumbUpIcon className="ml-3 h-5 w-5 fill-blue-500" />
                  </div>
                </div>
              ))}
          </div>
        </Container>
      </Wrapper> */}
    </>
  );
};
