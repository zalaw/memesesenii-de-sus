import React from "react";

const NotFound = () => {
  return (
    <div className="relative flex flex-col justify-center items-center flex-1">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] select-none font-bold dark:text-zinc-800 text-slate-200">
        404
      </div>
      <div className="relative z-20 text-center w-full max-w-[40rem] p-4 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold dark:text-slate-200 text-slate-800">
          Now that's a bit awkward...
        </h1>
        <p className="text-md sm:text-lg dark:text-slate-300 text-slate-700">
          Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to
          another URL
        </p>
      </div>
    </div>
  );
};

export default NotFound;
