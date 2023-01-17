import React from "react";
// import Datepicker from "flowbite-datepicker/Datepicker";

const inputClass =
  "bg-violet-200/10 border border-violet-300/40 text-white text-sm rounded-lg focus:ring-violet-900 focus:border-violet-900 block w-full p-2.5";
const labelClass = "block mb-1 text-sm font-medium text-violet-200/50";

export const Input = ({
  id,
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
    <input
      type="text"
      id={id}
      className={inputClass}
      required
      placeholder={placeholder}
      value={val}
      onChange={(e) => handleChange(e.target.value)}
      {...rest}
    />
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

// export const DatePicker = ({ placeholder }) => {
//   const datepickerEl = document.getElementById("datepickerId");
//   new Datepicker(datepickerEl, {});

//   return (
//     <div class="relative">
//       <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//         <svg
//           aria-hidden="true"
//           class="w-5 h-5 text-gray-500"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill-rule="evenodd"
//             d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//             clip-rule="evenodd"
//           ></path>
//         </svg>
//       </div>
//       <input
//         datepicker
//         type="text"
//         class={inputClass}
//         placeholder={placeholder}
//       />
//     </div>
//   );
// };
