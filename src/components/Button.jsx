import React from "react";
import { Row } from "../assets/styles/common.style";

export const Button = ({
  disabled,
  icon,
  title,
  handleClick,
  outlined,
  secondary,
  full,
}) => (
  <button
    disabled={disabled}
    className={`${
      full && "w-full"
    } flex flex-row items-center text-white p-4 px-6 rounded-full ${
      outlined
        ? "border hover:border-violet-300 hover:text-violet-300"
        : "bg-violet-500 hover:bg-violet-700"
    } ${
      secondary &&
      "text-violet-500 hover:text-violet-700 border-2 hover:border-violet-700 border-violet-500"
    } ${disabled && "bg-violet-300 hover:bg-violet-300 cursor-not-allowed"}`}
    onClick={handleClick}
  >
    <div
      className={`w-full flex flex-row ${
        icon ? "justify-between" : "justify-center"
      } tracking-widest`}
    >
      {title}
      {icon}
    </div>
  </button>
);
