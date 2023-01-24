import { CalendarIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { DatePicker } from "./Datepicker";

const inputClass =
  "bg-violet-200/10 border border-violet-300/40 text-white text-sm rounded-lg focus:ring-violet-900 focus:border-violet-900 block w-full p-2.5";
const labelClass = "block mb-1 text-sm font-medium text-violet-200/50";

export const Input = ({
  id,
  dateTime,
  setDateTime,
  placeholder,
  type,
  handleChange,
  val,
  ...rest
}) => (
  <div>
    <label for={id} className={labelClass}>
      {placeholder}
    </label>

    {type == "date" ? (
      <DatePicker
        dateTime={dateTime}
        setDateTime={setDateTime}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        id={id}
        className={inputClass}
        required
        placeholder={placeholder}
        value={val}
        onChange={(e) => handleChange(e.target.value)}
        {...rest}
      />
    )}
  </div>
);

export const Select = ({ id, placeholder, handleChange, options }) => (
  <div>
    <label for={id} className={labelClass}>
      {placeholder}
    </label>
    <select id={id} onChange={handleChange} className={inputClass}>
      {options.map(({ label, value }) => (
        <option value={value}>{label}</option>
      ))}
    </select>
  </div>
);

export const TextArea = ({ placeholder, handleChange, val }) => (
  <div>
    <label for={id} className={labelClass}>
      {placeholder}
    </label>
    <textarea
      className={inputClass}
      rows="3"
      placeholder={placeholder}
      value={val}
      onChange={(e) => handleChange(e.target.value)}
    ></textarea>
  </div>
);
