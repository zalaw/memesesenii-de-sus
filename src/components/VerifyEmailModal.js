import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheck, MdOutlineDoNotDisturb } from "react-icons/md";

import { useAuth } from "../contexts/AuthContext";

import Modal from "./Modal";
import Loader from "./Loader";
import CustomButton from "./CustomButton";

const VerifyEmailModal = ({ oobCode = "" }) => {
  const { setCurrentUser, verifyEmail, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    type: null,
    title: "Verifying email",
    body: "Hold on, we are verifing your email, it should be done in a sec",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleVerifyEmail = async () => {
      try {
        await verifyEmail(oobCode);
        await logout();

        setAlert({
          type: "success",
          title: "Email verified",
          body: "Looking good! Now you can sign in and enjoy this web app 😍",
        });
      } catch (err) {
        if (err.code === "auth/invalid-action-code")
          setAlert({
            type: "error",
            title: "Verification failed",
            body: "The email is already verified or the code is invalid",
          });
        else setAlert({ type: "error", title: "Unknown error" });
      } finally {
        setLoading(false);
      }
    };

    handleVerifyEmail();
  }, []);

  return (
    <Modal>
      <div className="p-10 flex flex-col gap-8">
        <div className="flex justify-center">
          {loading ? (
            <Loader forButton={false} primary={true} />
          ) : alert.type === "success" ? (
            <div className="text-4xl rounded-full p-2 text-green-600 bg-green-200">
              <MdCheck />
            </div>
          ) : (
            <div className="text-4xl rounded-full p-2 dark:bg-red-700 dark:bg-opacity-50 dark:text-red-400 bg-red-100 text-red-600">
              <MdOutlineDoNotDisturb />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-center text-xl font-semibold dark:text-slate-100 text-slate-700">{alert.title}</div>
          <div className="dark:text-slate-300 text-slate-600 text-center text-sm">{alert.body}</div>
        </div>

        {alert.type !== "error" && (
          <CustomButton
            text={loading ? "Almost there" : alert.type === "error" ? "Try again" : "Alright"}
            primary={true}
            disabled={loading}
            onClick={() => navigate("/")}
          />
        )}
      </div>
    </Modal>
  );
};

export default VerifyEmailModal;
