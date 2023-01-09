import React, { forwardRef } from "react";
import Loader from "./Loader";

const CustomButton = forwardRef(
  (
    {
      text = "",
      primary = false,
      rounded = false,
      disabled = false,
      loading = false,
      icon = null,
      type = "button",
      className = "",
      onClick = () => {},
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } dark:text-slate-200 relative group inline-flex items-center justify-center border border-transparent py-2 px-2 sm:px-4 text-xs sm:text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 
      ${rounded ? "rounded-full" : "rounded-md"}
      ${
        primary
          ? "text-white bg-gradient-to-r from-purple-500 to-blue-500 font-semibold hover:from-purple-400 hover:to-blue-400 focus-visible:outline-blue-600"
          : "dark:hover:bg-zinc-700 hover:bg-slate-200 text-slate-700 focus-visible:outline-slate-600"
      } ${className}`}
      >
        <div className={`${loading ? "opacity-0" : ""}`}>
          {icon}
          {text}
        </div>
        {loading && <Loader />}
      </button>
    );
  }
);

export default CustomButton;
