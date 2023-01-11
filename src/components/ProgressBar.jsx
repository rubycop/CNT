import React, { useEffect, useRef, useState } from "react";
import { timeDiffSeconds } from "../utils/utils";

export const ProgressBar = ({ time, plain }) => {
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
  useEffect(() => {}, [currentDate]);

  return (
    <div className={`relative ${!plain && "mt-2"}`}>
      <div
        className={`absolute h-2 ${
          plain ? "shadow-sm" : "rounded-full"
        } w-full bg-[#2d1f58]`}
      />
      <div
        style={{
          width: timeRange > 1 ? 10 : parseInt((1 - timeRange) * 100) + "%",
        }}
        className={`absolute z-10 h-2 ${
          !plain && "rounded-full"
        } bg-violet-700`}
      />
    </div>
  );
};
