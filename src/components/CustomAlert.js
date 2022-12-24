import React from "react";
import { MdInfo, MdWarning, MdDangerous, MdCheckCircle } from "react-icons/md";

const CustomAlert = ({ type = "info", title = "Default title", body = "" }) => {
  return (
    <div
      className={`${
        type === "info" ? "dark:bg-blue-700 dark:bg-opacity-20 dark:text-blue-400 bg-blue-100 text-blue-600" : ""
      } ${type === "error" ? "dark:bg-red-700 dark:bg-opacity-20 dark:text-red-400 bg-red-100 text-red-600" : ""} ${
        type === "warning"
          ? "dark:bg-yellow-700 dark:bg-opacity-20 dark:text-yellow-400 bg-yellow-100 text-yellow-600"
          : ""
      } ${
        type === "success" ? "dark:bg-green-700 dark:bg-opacity-20 dark:text-green-400 bg-green-100 text-green-600" : ""
      }
      py-2 px-4 text-xs sm:text-sm rounded-md flex items-center gap-4 border border-transparent`}
    >
      <div className="text-lg">
        {type === "info" ? (
          <MdInfo />
        ) : type === "warning" ? (
          <MdWarning />
        ) : type === "error" ? (
          <MdDangerous />
        ) : type === "success" ? (
          <MdCheckCircle />
        ) : null}
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">{title}</h2>
        <p className="">{body}</p>
      </div>
    </div>
  );
};

export default CustomAlert;
