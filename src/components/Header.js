import React, { useState, useRef } from "react";
import CustomButton from "./CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { setDarkTheme, setShowSignInModal, setShowSignUpModal } from "../features/ui/uiSlice";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import { MdOutlineDarkMode, MdOutlineDoorBack, MdOutlineImage, MdOutlineSettings } from "react-icons/md";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import CustomToggle from "./CustomToggle";
import useClickOutside from "../hooks/useClickOutside";
import { useAuth } from "../contexts/AuthContext";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { toast } from "react-toastify";

const Header = () => {
  // const { user } = useSelector(state => state.user);
  const { currentUser, logout, loading } = useAuth();
  const { darkTheme } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  const [showUserNav, setShowUserNav] = useState(false);

  const ref = useRef(null);

  const handleClick = e => {
    if (e.target.nodeName !== "A" && e.target.id !== "this-one") return;
    setShowUserNav(!showUserNav);
  };

  const handleToggleDarkTheme = e => {
    if (e.target.nodeName === "INPUT") return;
    dispatch(setDarkTheme(!darkTheme));
  };

  useClickOutside(ref, e => {
    if (showUserNav && e.target.id !== "this-one") setShowUserNav(false);
  });

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserNav(!showUserNav);
      toast.success("You are logged out!");
    } catch (err) {
      console.log(err);
    }
  };

  const userArea = loading ? (
    <Loader primary={true} forButton={false} />
  ) : currentUser ? (
    <button id="this-one" className="relative z-50" onClick={handleClick}>
      <UserAvatar id="this-one" />

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
  ) : (
    <div className="flex gap-x-2">
      <CustomButton text="Sign in" rounded={true} onClick={() => dispatch(setShowSignInModal(true))} />
      <CustomButton
        text="Sign up"
        className="border-none"
        rounded={true}
        primary={true}
        onClick={() => dispatch(setShowSignUpModal(true))}
      />
    </div>
  );

  // if (userAreaLoading) return null;

  return (
    <header className="py-2">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="relative flex justify-between items-center h-16">
          <div className="flex sm:gap-x-12">
            <Link to="/" onClick={() => setShowUserNav(false)}>
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div onClick={handleToggleDarkTheme}>
              <CustomButton
                icon={darkTheme ? <MdDarkMode className="text-xl" /> : <MdLightMode className="text-xl" />}
                rounded={true}
              />
            </div>
            {userArea}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
