import React, { useState } from "react";
import CustomButton from "./CustomButton";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

const HeaderUserLoggedOut = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  return (
    <div className="flex gap-x-2">
      {showSignInModal && (
        <SignInModal handlers={{ setShowSignInModal, setShowForgotPasswordModal, setShowSignUpModal }} />
      )}
      {showSignUpModal && (
        <SignUpModal handlers={{ setShowSignInModal, setShowForgotPasswordModal, setShowSignUpModal }} />
      )}
      {showForgotPasswordModal && (
        <ForgotPasswordModal handlers={{ setShowSignInModal, setShowForgotPasswordModal, setShowSignUpModal }} />
      )}

      <CustomButton text="Sign in" rounded={true} onClick={() => setShowSignInModal(true)} />
      <CustomButton
        text="Sign up"
        className="border-none"
        rounded={true}
        primary={true}
        onClick={() => setShowSignUpModal(true)}
      />
    </div>
  );
};

export default HeaderUserLoggedOut;
