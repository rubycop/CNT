import { ThumbUpIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import { Container, Wrapper } from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Skeleton } from "../components/Skeleton";
import { groupBy } from "../utils/utils";

export const Home = ({ currentUser }) => {
  const [loading, isLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [nfts, setNFTs] = useState([]);

  const getParticipants = async () => {
    isLoading(true);
    const _participants = await window.contract?.get_participants({});
    setParticipants(_participants);
    isLoading(false);
  };

  useEffect(() => {
    getParticipants();
  }, []);

  if (loading)
    return (
      <>
        <Header currentUser={currentUser} />
        <Wrapper>
          <Skeleton />
        </Wrapper>
      </>
    );

  return (
    <>
      <Header currentUser={currentUser} />
      <Wrapper>
        <Container className="pt-20 flex flex-col items-center w-full justify-center">
          <div className="mb-5 text-lg font-bold">Popular NFTs</div>
          <div className="w-3/4 flex flex-wrap">
            {participants
              .sort((a, b) => b.votes_count - a.votes_count)
              .map((p, i) => (
                <div className="flex m-3 mb-5 rounded-3xl relative" key={i}>
                  <div className="font-semibold text-base text-gray-700">
                    <img className="w-72 rounded-3xl" src={p.nft_src} />
                    <div className="absolute items-center -bottom-1 w-full rounded-l-3xl rounded-br-3xl  p-5 bg-white border">
                      <div className="flex justify-between">
                        <div className="text-base mt-2 w-40 text-gray-400 truncate">
                          {p.owner_id}
                        </div>
                        <div className="text-sm mt-1 flex items-center">
                          <span>{p.votes_count}</span>
                          <ThumbUpIcon className="ml-1 h-5 w-5 fill-blue-500" />
                        </div>
                      </div>
                      <div className="">
                        <a className="text-blue-500 text-xs" href="...">Link to origin ></a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Container>
      </Wrapper>
    </>
  );
};
