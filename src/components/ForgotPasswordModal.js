import { useState } from "react";
import { useFormik } from "formik";
import { MdClose } from "react-icons/md";

import Modal from "./Modal";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomAlert from "./CustomAlert";

import { useAuth } from "../contexts/AuthContext";
import { forgotPasswordSchema } from "../schemas";

const ResetPasswordModal = ({ handlers }) => {
  const { forgotPassword } = useAuth();

  const [message, setMessage] = useState({ type: null, title: null, body: null });
  const [sent, setSent] = useState(false);

  const onSubmit = async values => {
    setMessage({ type: null, title: null, body: null });

    try {
      await forgotPassword(values.email);
      setMessage({ type: "success", title: "Email sent successfully!", body: "Check your inbox (or spam)" });
      setSent(true);
    } catch (err) {
      if (["auth/user-not-found"].includes(err.code))
        setMessage({ type: "error", title: "This email is not registered" });
      else setMessage({ type: "error", title: "Unknown error. Try again later" });
    }
  };

  const handleShowSignInModal = () => {
    handlers.setShowForgotPasswordModal(false);
    handlers.setShowSignInModal(true);
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit,
  });

  const inputs = [
    {
      name: "email",
      type: "email",
      placeholder: "babajee420@test.com",
      label: "Email",
    },
  ];

  return (
    <Modal>
      <div className="flex items-start  p-6 sm:p-10">
        <div className="flex-1">
          <h2 className="antialiased font-sans font-medium text-lg sm:text-2xl leading-8 dark:text-slate-100 text-slate-900 mb-0 sm:mb-4">
            Forgot password?
          </h2>
          <p className="antialiased font-sans font-normal text-xs leading-6 dark:text-slate-300 text-slate-700 mb-0 sm:text-sm">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
        </div>

        <button
          tabIndex={0}
          onClick={() => handlers.setShowForgotPasswordModal(false)}
          className="dark:hover:bg-zinc-700 hover:bg-slate-200 text-xl p-2 cursor-pointer"
        >
          <MdClose />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="border-solid border-t border-b border-l-0 border-r-0 dark:border-zinc-600 border-slate-300"
      >
        <div className="p-6 sm:p-10">
          <div className="flex flex-col gap-2 sm:gap-4">
            {inputs.map(input => {
              return (
                <CustomInput
                  key={input.name}
                  value={values[input.name]}
                  onChange={handleChange}
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  label={input.label}
                  onBlur={handleBlur}
                  error={touched[input.name] && errors[input.name]}
                />
              );
            })}

            {message.type && <CustomAlert type={message.type} title={message.title} body={message.body} />}

            <CustomButton
              type="submit"
              loading={isSubmitting}
              text={sent ? "Resend reset link" : "Send reset link"}
              primary={true}
              className="mt-4"
            />
          </div>
        </div>
      </form>

      <div className="dark:text-slate-300 text-center flex flex-col gap-2 text-slate-700 text-xs sm:text-sm p-6 sm:p-10">
        <p>
          Back to{" "}
          <span className="text-blue-500 font-semibold cursor-pointer" onClick={handleShowSignInModal}>
            Sign in
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
