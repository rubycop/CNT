import React, { useEffect, useRef, useState } from "react";
import { formatDate, secondsToString, timeDiffSeconds } from "../utils/utils";
import { isActive, isIncomming } from "./contest/ContestItem";

export const Timer = ({ contest }) => {
  const funRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(Date.now());

  useEffect(() => {
    funRef.current = setInterval(() => {
      setCurrentDate(Date.now());
    }, 1000);
    return () => {
      clearInterval(funRef.current);
    };
  }, []);

  useEffect(() => {}, [currentDate]);

  return (
    <div
      className={`flex text-xs text-gray-400 text-center rounded-full uppercase`}
    >
      {isIncomming(contest) ? (
        <>Started at: {secondsToString(timeDiffSeconds(contest.start_time))}</>
      ) : isActive(contest) ? (
        <>Ended at: {secondsToString(timeDiffSeconds(contest.end_time))}</>
      ) : (
        <>
          {formatDate(contest.start_time)} - {formatDate(contest.end_time)}
        </>
      )}
    </div>
  );
};
