import React from "react";

const Loader = ({ primary = false, forButton = true }) => {
  return (
    <div
      className={`flex items-center justify-center text-sm ${
        forButton ? "absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]" : ""
      }`}
    >
      <div
        className={`${
          primary ? "border-blue-500" : ""
        } spinner-border animate-spin inline-block w-4 h-4 sm:w-6 sm:h-6 border-2 sm:border-4 rounded-full border-t-transparent`}
        role="status"
      ></div>
    </div>
  );
};

export default Loader;
