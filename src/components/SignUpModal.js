import { MdClose } from "react-icons/md";
import Modal from "./Modal";
import CustomButton from "./CustomButton";
import { setShowSignInModal, setShowSignUpModal } from "../features/ui/uiSlice";
import CustomInput from "./CustomInput";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import { useState } from "react";
import CustomAlert from "./CustomAlert";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

const SignUpModal = () => {
  const { signup, updateDisplayName, logout, sendVerificationEmail } = useAuth();
  const dispatch = useDispatch();

  const [firebaseMessage, setFirebaseMessage] = useState({ type: null, title: null, body: null });

  const onSubmit = async (values, actions) => {
    setFirebaseMessage({ type: null, title: null, body: null });

    try {
      await signup(values.email, values.password);
      await updateDisplayName(values.username);
      await addDoc(collection(db, "users"), { uid: auth.currentUser.uid, memes: [] });
      await sendVerificationEmail();
      await logout();

      setFirebaseMessage({
        type: "success",
        title: "Account created successfully",
        body: "Verify your email before singning in",
      });

      actions.resetForm();
    } catch (err) {
      console.log(err.code);
      if (err.code === "auth/email-already-in-use")
        setFirebaseMessage({ type: "error", title: "Email already in use" });
      else setFirebaseMessage({ type: "error", title: "Unknown error. Try again later" });
    }
  };

  const handleShowSignInModal = () => {
    dispatch(setShowSignUpModal(false));
    dispatch(setShowSignInModal(true));
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
          onClick={() => dispatch(setShowSignUpModal(false))}
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

            {firebaseMessage.type && (
              <CustomAlert type={firebaseMessage.type} title={firebaseMessage.title} body={firebaseMessage.body} />
            )}

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
