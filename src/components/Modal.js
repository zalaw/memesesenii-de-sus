import React from "react";

const Modal = ({ width = "", children }) => {
  // return (
  //   <div className="fixed z-10 flex justify-center items-center inset-0 bg-slate-400/50 overflow-y-auto">
  //     <div className="m-8 max-w-[400px] overflow-hidden w-full bg-white shadow-lg relative rounded-md">{children}</div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto h-full w-full" role={"dialog"} aria-modal={true}>
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          ​
        </span>
        <div
          className={`${width} dark:bg-zinc-800 inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md max-w-xs sm:max-w-md`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
