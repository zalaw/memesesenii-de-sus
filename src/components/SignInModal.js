import { useState } from "react";
import { useFormik } from "formik";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import Modal from "./Modal";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomAlert from "./CustomAlert";

import { useAuth } from "../contexts/AuthContext";
import { signInSchema } from "../schemas";

const SignInModal = ({ handlers }) => {
  const { signin, logout } = useAuth();

  const [message, setMessage] = useState({ type: null, title: null, body: null });

  const handleShowForgotPasswordModal = () => {
    handlers.setShowSignInModal(false);
    handlers.setShowForgotPasswordModal(true);
  };

  const handleShowSignUpModal = () => {
    handlers.setShowSignInModal(false);
    handlers.setShowSignUpModal(true);
  };

  const onSubmit = async values => {
    setMessage({ type: null, title: null, body: null });

    try {
      const userCredential = await signin(values.email, values.password);

      if (!userCredential.user.emailVerified) {
        await logout();
        setMessage({
          type: "error",
          title: "This email is not verified",
          body: "Check your inbox (or spam) for further information",
        });
      } else {
        toast.success(`Successfully logged in!`);
      }
    } catch (err) {
      if (["auth/wrong-password", "auth/user-not-found"].includes(err.code))
        setMessage({ type: "error", title: "Invalid credentials" });
      else if (err.code === "auth/user-disabled") setMessage({ type: "error", title: "This account is disabled 😳" });
      else setMessage({ type: "error", title: "Unknown error. Try again later" });
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit,
  });

  const inputs = [
    {
      name: "email",
      type: "email",
      placeholder: "babajee420@test.com",
      label: "Email",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Your super strong password here",
      label: "Password",
    },
  ];

  return (
    <Modal>
      <div className="flex items-start  p-6 sm:p-10">
        <div className="flex-1">
          <h2 className="antialiased font-sans font-medium text-lg sm:text-2xl leading-8 dark:text-slate-100 text-slate-900 mb-0 sm:mb-4">
            Sign in
          </h2>
          <p className="antialiased font-sans font-normal text-xs leading-6 dark:text-slate-300 text-slate-700 mb-0 sm:text-sm">
            Sign in with your email here.
          </p>
        </div>

        <button
          tabIndex={0}
          onClick={() => handlers.setShowSignInModal(false)}
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

            <CustomButton type="submit" loading={isSubmitting} text="Sign in" primary={true} className="mt-4" />
          </div>
        </div>
      </form>

      <div className="dark:text-slate-300 text-center flex flex-col gap-2 text-slate-700 text-xs sm:text-sm p-6 sm:p-10">
        <p>
          Forgot password?{" "}
          <span className="text-blue-500 font-semibold cursor-pointer" onClick={handleShowForgotPasswordModal}>
            Reset
          </span>
        </p>
        <p>
          Don't have an account?{" "}
          <span className="text-blue-500 font-semibold cursor-pointer" onClick={handleShowSignUpModal}>
            Sign up
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default SignInModal;
