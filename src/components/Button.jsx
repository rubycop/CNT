import React from "react";
import { Row } from "../assets/styles/common.style";

export const Button = ({ icon, title, handleClick, outlined, full }) => (
  <button
    className={`${
      full && "w-full"
    } flex flex-row items-center text-white p-3 px-5 rounded-full ${
      outlined
        ? "border hover:border-violet-300 hover:text-violet-300"
        : "bg-violet-500 hover:bg-violet-700"
    }`}
    onClick={handleClick}
  >
    <div className="w-full flex flex-row justify-between">
      {title}
      {icon}
    </div>
  </button>
);
