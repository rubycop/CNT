import { createContext, useState } from "react";

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState();
  const [notificationDescription, setNotificationDescription] = useState();

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        setShowNotification,
        notificationText,
        setNotificationText,
        notificationDescription,
        setNotificationDescription,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
