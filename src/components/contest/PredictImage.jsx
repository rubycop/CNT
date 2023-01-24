import { EyeIcon, HeartIcon } from "@heroicons/react/outline";
import { TrendingDownIcon, TrendingUpIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { Button } from "../Button";
import { PredictContestModal } from "./PredictContestModal";

export const PredictImage = ({ participant, totalStake, predictions }) => {
  const participantStake =
    predictions?.map((p) => p.amount)?.reduce((a, b) => a + b, 0) || 0;

  const winRate = parseInt(totalStake / (participantStake || 1)).toFixed(2);

  const [showModal, setShowModal] = useState(false);

  const RateContent = () => {
    const rate =
      winRate > 5
        ? ["High", "red"]
        : winRate > 3
        ? ["Medium", "blue"]
        : ["Low", "green"];

    return (
      <div className="mt-2 flex justify-between">
        <h6 className="text-base flex">
          Win rate
          <div
            className={`ml-3 text-center py-1 px-2 border border-solid border-${rate[1]}-500 bg-${rate[1]}-500/60 text-white text-xs rounded-full`}
          >
            {rate[0]}
          </div>
        </h6>

        <div className={`flex items-center text-${rate[1]}-500`}>
          {winRate > 5 ? (
            <TrendingUpIcon className="w-5 mr-1" />
          ) : (
            <TrendingDownIcon className="w-5 mr-1" />
          )}
          x{winRate}
        </div>
      </div>
    );
  };

  return (
    <div className=" mx-3 p-5 text-base bg-gray-900 border border-solid border-violet-300/20 rounded-2xl">
      <img
        className="w-72 h-64 object-cover rounded-xl"
        src={participant.nft_src}
        onError={(error) =>
          (error.target.src = require("../../assets/images/no-image.png"))
        }
      />
      <div className="mt-5 flex justify-between">
        <h6 className="">Total liked</h6>

        <div className="flex items-center">
          <HeartIcon className="w-5 h-5 mr-1" />
          {participant.votes_count}
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <h6 className="">Total viewed</h6>

        <div className="flex items-center">
          <EyeIcon className="w-5 h-5 mr-1" />
          {participant.votes_count}
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <h6 className="">Total CNT staked</h6>

        <div className="flex items-center">{participantStake} CNT</div>
      </div>

      <RateContent />

      <div className="w-full mt-5">
        <Button full handleClick={() => setShowModal(true)} title="Stake" />
        <PredictContestModal
          showModal={showModal}
          setShowModal={setShowModal}
          participantId={participant.id}
        />
      </div>
    </div>
  );
};
