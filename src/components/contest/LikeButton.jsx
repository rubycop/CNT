import { ThumbUpIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

export const LikeButton = ({ handleVote }) => {
  const [showLike, setShowLike] = useState(false);

  return (
    <div
      onMouseOver={() => setShowLike(true)}
      onMouseLeave={() => setShowLike(false)}
      className="flex hover:bg-black/50 justify-center items-center w-full h-full hover:backdrop-blur-md"
    >
      <div className="relative flex justify-center items-center">
        <ThumbUpIcon
          className={`${
            showLike ? "block" : "hidden"
          } absolute w-16 h-16 animate-ping text-white hover:cursor-pointer`}
          onClick={handleVote}
        />
        <ThumbUpIcon
          className={`${
            showLike ? "block" : "hidden"
          } absolute w-24 h-24 text-white hover:cursor-pointer`}
          onClick={handleVote}
        />
      </div>
    </div>
  );
};
