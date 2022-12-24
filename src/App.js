import { useEffect } from "react";

import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import ResetPasswordModal from "./components/ForgotPasswordModal";
import Header from "./components/Header";

import Main from "./pages/Main";
import MyMemes from "./pages/MyMemes";
import Settings from "./pages/Settings";
import Footer from "./components/Footer";

import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Handle from "./pages/Handle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { darkTheme, showSignInModal, showSignUpModal, showForgotPasswordModal } = useSelector(state => state.ui);

  useEffect(() => {
    localStorage.setItem("MDS_DARK_THEME", darkTheme);
  }, [darkTheme]);

  return (
    <AuthProvider>
      <div className={`${darkTheme ? "dark" : ""} dark:text-slate-200 h-full`}>
        <div className="dark:text-slate-200 dark:bg-zinc-900 min-h-full flex flex-col">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkTheme ? "dark" : "light"}
          />

          {showSignInModal && <SignInModal />}
          {showSignUpModal && <SignUpModal />}
          {showForgotPasswordModal && <ResetPasswordModal />}
          <Header />

          <div className="flex-1 py-8 max-w-7xl mx-auto w-full px-4">
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
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
