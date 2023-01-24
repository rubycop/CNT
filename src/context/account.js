import { createContext, useState } from "react";

export const AccountContext = createContext({});

export const AccountProvider = ({ children }) => {
  const [reward, setReward] = useState("-");
  const [xp, setXP] = useState("-");

  return (
    <AccountContext.Provider
      value={{
        reward,
        setReward,
        xp,
        setXP,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
