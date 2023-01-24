import { HeartIcon } from "@heroicons/react/outline";
import React from "react";
import { TrophyIcon } from "../../utils/utils";

export const ContestImage = ({ contest, participant, winner }) => (
  <div className="mx-3 p-5 bg-gray-900 border border-solid border-violet-300/20 rounded-2xl">
    {winner && (
      <div className="absolute z-30 m-3">
        <TrophyIcon styles="w-7 h-7" />
      </div>
    )}
    <img
      className="w-72 h-64 object-cover rounded-xl"
      src={participant.nft_src}
    />
    <div className="mt-5 flex justify-between">
      <h5 className="text-xl">{contest.title}</h5>

      <div className="flex items-center">
        <HeartIcon className="w-7 h-7 mr-1" />
        {participant.votes_count}
      </div>
    </div>

    <h6 className="text-sm mb-3">{participant.owner_id}</h6>

    <a href={participant.nft_src} className="text-sm">
      Visit to buy <i className="fa fa-link ml-1"></i>
    </a>
  </div>
);
