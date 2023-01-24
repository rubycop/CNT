import React from "react";
import { Row } from "../assets/styles/common.style";

export const Button = ({
  disabled,
  icon,
  title,
  handleClick,
  outlined,
  secondary,
  white,
  full,
}) => (
  <button
    disabled={disabled}
    className={`${
      full && "w-full"
    } flex flex-row items-center text-white p-4 px-6 rounded-full
    ${
      disabled
        ? "text-violet-200/50 bg-violet-300/20 hover:bg-violet-300/20 cursor-not-allowed"
        : outlined
        ? `border-2 ${
            white
              ? "border-violet-200 text-violet-200 hover:border-white hover:text-white"
              : "hover:border-violet-500 hover:text-violet-500"
          }`
        : `${
            white
              ? "text-black bg-violet-200 hover:bg-white"
              : "bg-violet-700 hover:bg-violet-800"
          }`
    } ${
      secondary &&
      "text-violet-500 hover:text-violet-700 border-2 hover:border-violet-700 border-violet-500"
    } 
    `}
    onClick={handleClick}
  >
    <div className={`w-full flex flex-row justify-center tracking-wider`}>
      {title}
      {icon}
    </div>
  </button>
);
