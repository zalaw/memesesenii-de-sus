import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import ResetPasswordModal from "./components/ForgotPasswordModal";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

import Main from "./pages/Main";
import Handle from "./pages/Handle";
import MyMemes from "./pages/MyMemes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import { useUserInterface } from "./contexts/UserInterfaceContext";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const { darkTheme } = useUserInterface();

  return (
    <div className={`${darkTheme ? "dark" : ""} dark:text-slate-200 h-full`}>
      <div className="dark:text-slate-200 dark:bg-zinc-900 min-h-full flex flex-col">
        <ToastContainer />

        <Header />

        <div className="flex flex-col flex-1 py-8 max-w-7xl mx-auto w-full px-4">
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/handle/:email" element={<Handle />}></Route>
            <Route
              path="/my-memes"
              element={
                <PrivateRoute>
                  <MyMemes />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            ></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
