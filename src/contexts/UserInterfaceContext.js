import React, { createContext, useContext, useEffect, useState } from "react";

const UserInterfaceContext = createContext();

export function useUserInterface() {
  return useContext(UserInterfaceContext);
}

export function UserInterfaceProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState();

  function toggleDarkTheme() {
    setDarkTheme(prev => {
      localStorage.setItem("MDS_DARK_THEME", !prev);
      return !prev;
    });
  }

  useEffect(() => {
    setDarkTheme(localStorage.getItem("MDS_DARK_THEME") === "true");
  }, []);

  const value = {
    darkTheme,
    toggleDarkTheme,
  };

  return <UserInterfaceContext.Provider value={value}>{children}</UserInterfaceContext.Provider>;
}
