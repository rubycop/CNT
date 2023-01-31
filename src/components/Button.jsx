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
  small,
}) => (
  <button
    disabled={disabled}
    className={`
    ${full && "w-full"} flex flex-row items-center text-white ${
      small ? "p-3 text-sm" : "p-4"
    } px-6 rounded-full
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
      `${
        !outlined
          ? "bg-violet-400/20 text-violet-100/50 hover:text-violet-100/70 hover:bg-violet-400/30"
          : "text-violet-300/40 hover:text-violet-300/70 border-2 hover:border-violet-300/70 border-violet-300/40"
      }`
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
