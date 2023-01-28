import { HeartIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";
import { NearContext } from "../../context/near";
import { mediaURL, TrophyIcon } from "../../utils/utils";

export const ContestImage = ({ contest, participant, winner }) => {
  const near = useContext(NearContext);

  const [nft, setNft] = useState();
  const collectionId = participant.token_id.split(":")[0];

  const fetchNFTData = async () => {
    const nft = await near.mainContract.nftToken({
      token_id: participant.token_id,
    });
    if (nft) setNft(nft);
  };

  useEffect(() => {
    fetchNFTData();
  }, []);

  return (
    <div className="mx-3 p-5 bg-gray-900 border border-solid border-violet-300/20 rounded-2xl">
      {winner && (
        <div className="absolute z-30 m-3">
          <TrophyIcon styles="w-7 h-7" />
        </div>
      )}
      {nft && (
        <>
          <img
            className="w-72 h-64 object-cover rounded-xl"
            src={mediaURL(participant.nft_src)}
            onError={(error) =>
              (error.target.src = require("../../assets/images/no-image.png"))
            }
          />
          <div className="mt-5 flex justify-between">
            <h5 className="text-xl">{nft.metadata.title}</h5>

            <div className="flex items-center">
              <HeartIcon className="w-7 h-7 mr-1" />
              {participant.votes_count}
            </div>
          </div>
        </>
      )}

      <h6 className="text-sm mb-3">{participant.owner_id}</h6>
      <div className="flex justify-between">
        <a href={"/contest/${contest.id}"} className="text-sm mb-1">
          View Contest
          <i className="fa fa-link ml-1"></i>
        </a>

        <a
          href={`${process.env.PARAS_VIEW_URL}::${collectionId}/${participant.token_id}`}
          target="_blank"
          className="text-sm"
        >
          Visit to Buy <i className="fa fa-link ml-1"></i>
        </a>
      </div>
    </div>
  );
};
