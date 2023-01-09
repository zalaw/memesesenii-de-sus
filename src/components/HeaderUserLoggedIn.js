import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineImage, MdOutlineSettings, MdOutlineDoorBack } from "react-icons/md";
import { toast } from "react-toastify";
import useClickOutside from "../hooks/useClickOutside";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../contexts/AuthContext";

const HeaderUserLoggedIn = () => {
  const { currentUser, logout } = useAuth();

  const [showUserNav, setShowUserNav] = useState(false);

  const ref = useRef(null);

  useClickOutside(ref, e => {
    if (showUserNav && e.target.id !== "this-one") setShowUserNav(false);
  });

  const handleClick = e => {
    if (e.target.nodeName !== "A" && e.target.id !== "this-one") return;
    setShowUserNav(!showUserNav);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserNav(!showUserNav);
      toast.success("You are logged out!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button id="this-one" className="relative z-50" onClick={handleClick}>
      <UserAvatar imgURL={currentUser.photoURL} id="this-one" />

      <div
        ref={ref}
        className={`${
          !showUserNav ? "hidden" : ""
        } absolute top-full min-w-[200px] w-max drop-shadow-lg shadow-lg dark:bg-zinc-800 dark:text-slate-200 bg-white transition right-0 px-4 mt-4 text-sm text-slate-800 font-semibold`}
      >
        <div className="flex gap-4 items-center py-4">
          <UserAvatar />
          <span>{currentUser.displayName}</span>
        </div>

        <div className="flex flex-col items-start border-solid border-b border-t border-l-0 border-r-0 dark:border-zinc-600 border-slate-300  py-4">
          <Link
            to="/my-memes"
            className=" dark:hover:bg-zinc-700 hover:bg-slate-200 rounded-md w-full text-left p-2 flex items-center gap-2"
          >
            <div className="text-xl">
              <MdOutlineImage />
            </div>
            My memes
          </Link>
          <Link
            to="/settings"
            className="dark:hover:bg-zinc-700 hover:bg-slate-200 rounded-md w-full text-left p-2 flex items-center gap-2"
          >
            <div className="text-xl">
              <MdOutlineSettings />
            </div>
            Settings
          </Link>
        </div>

        <div className="py-4">
          <div
            className="dark:hover:bg-zinc-700 hover:bg-slate-200 rounded-md w-full text-left p-2 flex items-center gap-2"
            onClick={handleLogout}
          >
            <div className="text-xl">
              <MdOutlineDoorBack />
            </div>
            Logout
          </div>
        </div>
      </div>
    </button>
  );
};

export default HeaderUserLoggedIn;
