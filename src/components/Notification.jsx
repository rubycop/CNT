import { XIcon } from "@heroicons/react/solid";
import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../context/notification";

export const Notification = () => {
  const {
    showNotification,
    setShowNotification,
    notificationText,
    notificationDescription,
  } = useContext(NotificationContext);

  useEffect(() => {
    setTimeout(() => {
      if (showNotification) setShowNotification(false);
    }, 7000);
  }, []);

  if (!showNotification) return <></>;

  return (
    <div
      class="w-full lg:w-96
       fixed top-5 right-5 bg-gray-900 rounded-md text-white w-90 border border-solid border-violet-300/40 z-30 px-4 py-3 shadow-md"
      role="alert"
    >
      <div class="flex flexe-row justify-between items-start">
        <div className="flex">
          <div class="py-1">
            <svg
              class="fill-current h-6 w-6 text-violet-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">{notificationText}</p>
            <p class="text-sm font-normal">{notificationDescription}</p>
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => setShowNotification(false)}
        >
          <XIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
