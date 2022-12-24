import React from "react";
import { useParams, useLocation } from "react-router-dom";

import ResetPasswordModal from "../components/ResetPasswordModal";
import VerifyAndChangeEmailModal from "../components/VerifyAndChangeEmailModal";
import VerifyEmailModal from "../components/VerifyEmailModal";

const Handle = () => {
  const { email } = useParams();
  const { search } = useLocation();

  const mode = new URLSearchParams(search).get("mode");
  const oobCode = new URLSearchParams(search).get("oobCode");

  return (
    <div>
      {mode === "resetPassword" && <ResetPasswordModal email={email} oobCode={oobCode} />}
      {mode === "verifyEmail" && <VerifyEmailModal oobCode={oobCode} />}
      {mode === "verifyAndChangeEmail" && <VerifyAndChangeEmailModal email={email} oobCode={oobCode} />}
    </div>
  );
};

export default Handle;
