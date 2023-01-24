import React, { useEffect, useState } from "react";

export const Tab = ({ tab, title, mode, setMode }) => {
  return (
    <div
      onClick={() => setMode(tab)}
      className={`hover:cursor-pointer border border-solid  p-5 text-base rounded-full w-full text-center hover:text-white font-semibold tracking-wide ${
        mode === tab
          ? "text-violet-600 border-violet-600"
          : "text-white/30  bg-violet-900/10"
      }`}
    >
      {title}
    </div>
  );
};
