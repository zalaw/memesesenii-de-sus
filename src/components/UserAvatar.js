import React from "react";

const UserAvatar = ({ imgURL, id, className }) => {
  return (
    <img
      id={id}
      className={`${className ? className : "w-10 h-10 sm:w-12 sm:h-12"} bg-slate-200 rounded-full overflow-hidden`}
      src={
        imgURL ||
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wsy.dk%2Fwp-content%2Fuploads%2F2016%2F01%2FAvatar-placeholder.png&f=1&nofb=1&ipt=9473aac07d0d16384dcdfe1ec20ec3ee17026bfb8ba797ca4be9a0b3795762f3&ipo=images"
      }
      alt="Avatar"
    />
  );
};

export default UserAvatar;
