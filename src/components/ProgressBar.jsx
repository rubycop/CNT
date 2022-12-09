import React, { useEffect, useRef, useState } from "react";
import { timeDiffSeconds } from "../utils/utils";

export const ProgressBar = ({ time }) => {
  const funRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(Date.now());

  useEffect(() => {
    funRef.current = setInterval(() => {
      setCurrentDate(Date.now());
    }, 60000);
    return () => {
      clearInterval(funRef.current);
    };
  }, []);

  const timeRange = timeDiffSeconds(time) / (3600 * 24 * 7);
  console.log(timeRange);
  useEffect(() => {}, [currentDate]);

  return (
    <div className="relative mt-2">
      <div className="absolute h-2 rounded-full w-full bg-purple-200" />
      <div
        style={{
          width: timeRange > 1 ? 10 : parseInt((1 - timeRange) * 100) + "%",
        }}
        className={`absolute z-10 h-2 rounded-full bg-violet-700`}
      />
    </div>
  );
};
