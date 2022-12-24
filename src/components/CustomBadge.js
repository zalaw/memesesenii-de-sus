import React from "react";

const CustomBadge = ({ text, icon, className }) => {
  return (
    <div className={`${className} text-xs flex items-center gap-1 w-fit py-1 px-2 rounded-full`}>
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  );
};

export default CustomBadge;
