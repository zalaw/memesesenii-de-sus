import React from "react";
import { Link } from "react-router-dom";
import { MdLightMode, MdDarkMode } from "react-icons/md";

import CustomButton from "./CustomButton";
import Logo from "./Logo";

import { useAuth } from "../contexts/AuthContext";
import { useUserInterface } from "../contexts/UserInterfaceContext";

import HeaderUserLoggedIn from "./HeaderUserLoggedIn";
import HeaderUserLoggedOut from "./HeaderUserLoggedOut";

const Header = () => {
  const { darkTheme, toggleDarkTheme } = useUserInterface();
  const { currentUser } = useAuth();

  return (
    <header className="py-2 z-50 sticky top-0 dark:bg-zinc-900 bg-white dark:shadow-2xl shadow-md">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="relative flex justify-between items-center h-16">
          <div className="flex sm:gap-x-12">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div onClick={toggleDarkTheme}>
              <CustomButton
                icon={darkTheme ? <MdDarkMode className="text-xl" /> : <MdLightMode className="text-xl" />}
                rounded={true}
              />
            </div>
            {currentUser ? <HeaderUserLoggedIn /> : <HeaderUserLoggedOut />}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
