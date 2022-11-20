import React from "react";

export const Input = ({ placeholder, type, handleChange, val, ...rest }) => (
  <input
    type={type ?? "text"}
    className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    placeholder={placeholder}
    value={val}
    onChange={(e) => handleChange(e.target.value)}
    {...rest}
  />
);

export const TextArea = ({ placeholder, handleChange, val }) => (
  <textarea
    className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
    rows="3"
    placeholder={placeholder}
    value={val}
    onChange={(e) => handleChange(e.target.value)}
  ></textarea>
);
