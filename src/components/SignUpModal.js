import { useState } from "react";
import { useFormik } from "formik";
import { MdClose } from "react-icons/md";

import Modal from "./Modal";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomAlert from "./CustomAlert";

import { useAuth } from "../contexts/AuthContext";
import { signUpSchema } from "../schemas";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

const SignUpModal = ({ handlers }) => {
  const { signup, updateDisplayName, logout, sendVerificationEmail } = useAuth();

  const [message, setMessage] = useState({ type: null, title: null, body: null });

  const handleShowSignInModal = () => {
    handlers.setShowSignUpModal(false);
    handlers.setShowSignInModal(true);
  };

  const onSubmit = async values => {
    setMessage({ type: null, title: null, body: null });

    try {
      await signup(values.email, values.password);
      await updateDisplayName(values.username);
      await addDoc(collection(db, "users"), {
        userId: auth.currentUser.uid,
        displayName: values.username,
        avatar: null,
        avatarFileName: null,
        memes: [],
      });
      await sendVerificationEmail();
      await logout();

      setMessage({
        type: "success",
        title: "Account created successfully",
        body: "Verify your email before signin in",
      });
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      if (err.code === "auth/email-already-in-use") setMessage({ type: "error", title: "Email already in use" });
      else setMessage({ type: "error", title: "Unknown error. Try again later" });
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  const inputs = [
    {
      name: "username",
      type: "text",
      placeholder: "babajee420",
      label: "Username",
    },
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
    {
      name: "repeatPassword",
      type: "password",
      placeholder: "Repeat your super strong password",
      label: "Repeat password",
    },
  ];

  return (
    <Modal>
      <div className="flex items-start  p-6 sm:p-10">
        <div className="flex-1">
          <h2 className="antialiased font-sans font-medium text-lg sm:text-2xl leading-8 dark:text-slate-100 text-slate-900 mb-0 sm:mb-4">
            Sign up
          </h2>
          <p className="antialiased font-sans font-normal text-xs leading-6 dark:text-slate-300 text-slate-700 mb-0 sm:text-sm">
            Create a free account with your email.
          </p>
        </div>

        <button
          tabIndex={0}
          onClick={() => handlers.setShowSignUpModal(false)}
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

            <CustomButton type="submit" loading={isSubmitting} text="Sign up" primary={true} className="mt-4" />
          </div>
        </div>
      </form>

      <div className="dark:text-slate-300 text-center flex flex-col gap-2 text-slate-700 text-xs sm:text-sm p-6 sm:p-10">
        <p>
          Already have an account?{" "}
          <span className="text-blue-500 font-semibold cursor-pointer" onClick={handleShowSignInModal}>
            Sign in
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default SignUpModal;
