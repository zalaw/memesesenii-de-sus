import { MdClose } from "react-icons/md";
import Modal from "./Modal";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import { useFormik } from "formik";
import { resetPasswordSchema } from "../schemas";
import { useState } from "react";
import CustomAlert from "./CustomAlert";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ResetPasswordModal = ({ email = "😳", oobCode = "" }) => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [firebaseMessage, setFirebaseMessage] = useState({ type: null, title: null, body: null });

  const onSubmit = async (values, actions) => {
    setFirebaseMessage({ type: null, title: null, body: null });

    try {
      await resetPassword(oobCode, values.password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-action-code")
        setFirebaseMessage({
          type: "error",
          title: "Password reset failed",
          body: "The link might have expired or is invalid",
        });
      else setFirebaseMessage({ type: "error", title: "Unknown error. Try again later" });
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit,
  });

  const inputs = [
    {
      name: "password",
      type: "password",
      placeholder: "Your new super strong password here",
      label: "Password",
    },
  ];

  console.log(email);

  return (
    <Modal>
      <div className="flex items-start  p-6 sm:p-10">
        <div className="flex-1">
          <h2 className="antialiased font-sans font-medium text-lg sm:text-2xl leading-8 dark:text-slate-100 text-slate-900 mb-0 sm:mb-4">
            Reset your password
          </h2>
          <p className="antialiased font-sans font-normal text-xs leading-6 dark:text-slate-300 text-slate-700 mb-0 sm:text-sm">
            Choose a new password for{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              {email}
            </span>
          </p>
        </div>

        <button
          tabIndex={0}
          onClick={handleClose}
          className="dark:hover:bg-zinc-700 hover:bg-slate-200 text-xl p-2 cursor-pointer"
        >
          <MdClose />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="border-solid border-t border-b-0 border-l-0 border-r-0 dark:border-zinc-600 border-slate-300"
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

            <CustomButton type="submit" loading={isSubmitting} text="Reset" primary={true} className="mt-4" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;
