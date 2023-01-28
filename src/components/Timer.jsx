import { ClockIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import {
  formatDate,
  isActive,
  isIncomming,
  secondsToString,
  timeDiffSeconds,
} from "../utils/utils";

export const Timer = ({ contest }) => {
  // const funRef = useRef(null);
  // const [currentDate, setCurrentDate] = useState(Date.now());

  // useEffect(() => {
  //   funRef.current = setInterval(() => {
  //     setCurrentDate(Date.now());
  //   }, 1000);
  //   return () => {
  //     clearInterval(funRef.current);
  //   };
  // }, []);

  // useEffect(() => {}, [currentDate]);

  return (
    <div
      className={`flex tracking-wide font-medium
       text-center rounded-full items-center`}
    >
      <ClockIcon className="w-5 h-5 mr-3" />
      {isIncomming(contest) ? (
        <>
          Starts at:{" "}
          {secondsToString(timeDiffSeconds(parseInt(contest.start_time)))}
        </>
      ) : isActive(contest) ? (
        <>
          Ends at:{" "}
          {secondsToString(timeDiffSeconds(parseInt(contest.end_time)))}
        </>
      ) : (
        <>
          Contest is ended:{" "}
          <>
            {formatDate(contest.start_time)} -{" "}
            {formatDate(parseInt(contest.end_time))}
          </>
        </>
      )}
    </div>
  );
};
