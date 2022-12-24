import React, { forwardRef } from "react";

const CustomInput = forwardRef(({ label, name, error, inputClassName, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="dark:text-slate-300 font-semibold text-xs sm:text-sm text-slate-500" htmlFor={name}>
          {label}
        </label>
      )}

      <input
        id={name}
        ref={ref}
        className={`${
          error ? "border-red-600 dark:border-red-600" : "dark:border-zinc-700"
        } dark:text-slate-300 dark:focus:border-blue-600 dark:bg-zinc-700 bg-slate-100 text-slate-800  font-semibold px-3 py-2 rounded-md text-xs sm:text-sm border transition focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`}
        name={name}
        {...props}
      />

      {error && <div className="text-xs sm:text-sm text-red-600">{error}</div>}
    </div>
  );
});

export default CustomInput;
