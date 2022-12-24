import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Main = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <p>Main</p>
      <p>{JSON.stringify(currentUser, null, 2)}</p>
    </div>
  );
};

export default Main;
