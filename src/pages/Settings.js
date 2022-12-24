import React, { useRef, useState } from "react";
import SettingsCard from "../components/SettingsCard";
import UserAvatar from "../components/UserAvatar";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../contexts/AuthContext";
import CustomAlert from "../components/CustomAlert";
import ImagePreview from "../components/ImagePreview";
import { useFormik } from "formik";
import { changeUsernameSchema, changeEmailSchema, changePasswordSchema } from "../schemas";

const Settings = () => {
  const { currentUser, setCurrentUser, updateDisplayName, verifyThenUpdateEmail, reauthenticate, updateUsersPassword } =
    useAuth();

  const [imageMessage, setImageMessage] = useState({ type: null, title: null, body: null });
  const [usernameMessage, setUsernameMessage] = useState({ type: null, title: null, body: null });
  const [emailMessage, setEmailMessage] = useState({ type: null, title: null, body: null });
  const [passwordMessage, setPasswordMessage] = useState({ type: null, title: null, body: null });
  const [imgSrc, setImgSrc] = useState("");

  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

  const ref = useRef(null);

  const handleUploadProfilePicture = e => {
    ref.current.click();
  };

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file);

      if (!allowedTypes.includes(file.type)) {
        return setImageMessage({
          type: "error",
          title: "Invalid file format",
          body: "Only JPG, JPEG, PNG and GIF allowed",
        });
      }

      if (file.size > 2097152) {
        return setImageMessage({ type: "error", title: "Max size exceeded", body: "Size cannot exceed 2MB" });
      }

      setImageMessage({ type: null, title: null, body: null });
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(file);
    }
  }

  const usernameOnSubmit = async (values, actions) => {
    setUsernameMessage({ type: null, title: null, body: null });

    try {
      await updateDisplayName(values.username);

      setCurrentUser(prev => ({
        ...prev,
        displayName: values.username,
      }));

      actions.validateForm();
      setUsernameMessage({
        type: "success",
        title: "Username updated successfully!",
        body: `Looking good there ${values.username}!`,
      });
    } catch (err) {
      setUsernameMessage({ type: "error", title: "Unknown error" });
    }
  };

  const emailOnSubmit = async (values, actions) => {
    setEmailMessage({ type: null, title: null, body: null });

    try {
      await reauthenticate(currentUser.email, values.password);
      await verifyThenUpdateEmail(values.email);

      setEmailMessage({
        type: "success",
        title: "Email successfully sent",
        body: "One more step before this process is finished, check your inbox (or spam) for further information",
      });
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));

      if (err.code === "auth/wrong-password")
        setEmailMessage({
          type: "error",
          title: "Email change failed",
          body: "The password is incorrect, c'mon bruh, it's your password after all",
        });
      else if (err.code === "auth/email-already-in-use")
        setEmailMessage({
          type: "error",
          title: "Email change failed",
          body: "Oh snap, looks like this email is already in use",
        });
      else setEmailMessage({ type: "error", title: "Unknown error" });
    }
  };

  const passwordOnSubmit = async (values, actions) => {
    setPasswordMessage({ type: null, title: null, body: null });

    try {
      if (values.currentPassword === values.newPassword)
        return setPasswordMessage({
          type: "error",
          title: "Password change failed",
          body: "Passwords cannot be the same",
        });

      await reauthenticate(currentUser.email, values.currentPassword);
      await updateUsersPassword(values.newPassword);

      setPasswordMessage({
        type: "success",
        title: "Password successfully updated",
      });

      actions.resetForm();
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log(err);

      if (err.code === "auth/wrong-password")
        setPasswordMessage({
          type: "error",
          title: "Password change failed",
          body: "The password is incorrect, c'mon bruh, it's your password after all",
        });
      else setPasswordMessage({ type: "error", title: "Unknown error" });
    }
  };

  const {
    values: usernameValues,
    errors: usernameErrors,
    touched: usernameTouched,
    isSubmitting: usernameIsSubmitting,
    handleBlur: usernameHandleBlur,
    handleChange: usernameHandleChange,
    handleSubmit: usernameHandleSubmit,
  } = useFormik({
    initialValues: {
      username: currentUser.displayName,
    },
    validationSchema: changeUsernameSchema,
    onSubmit: usernameOnSubmit,
  });

  const {
    values: emailValues,
    errors: emailErrors,
    touched: emailTouched,
    isSubmitting: emailIsSubmitting,
    handleBlur: emailHandleBlur,
    handleChange: emailHandleChange,
    handleSubmit: emailHandleSubmit,
  } = useFormik({
    initialValues: {
      password: "",
      email: currentUser.email,
    },
    validationSchema: changeEmailSchema,
    onSubmit: emailOnSubmit,
  });

  const {
    values: passwordValues,
    errors: passwordErrors,
    touched: passwordTouched,
    isSubmitting: passwordIsSubmitting,
    handleBlur: passwordHandleBlur,
    handleChange: passwordHandleChange,
    handleSubmit: passwordHandleSubmit,
  } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: passwordOnSubmit,
  });

  return (
    <>
      {imgSrc && (
        <ImagePreview
          src={imgSrc}
          handleClose={() => {
            setImgSrc("");
            ref.current.value = "";
          }}
        />
      )}

      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <SettingsCard>
          <div className="flex flex-col gap-4 sm:gap-8">
            <h1 className="dark:text-slate-100 text-md sm:text-2xl font-semibold text-slate-700">Profile picture</h1>

            {imageMessage.type && (
              <CustomAlert type={imageMessage.type} title={imageMessage.title} body={imageMessage.body} />
            )}

            <div className="flex gap-4 items-center">
              <UserAvatar className="w-20 aspect-square" />
              <div className="flex flex-col gap-2 items-start">
                <CustomButton text={"Upload profile picture"} primary={true} onClick={handleUploadProfilePicture} />
                <div className="w-0 h-0 hidden">
                  {/* <CustomInput
                    value={image}
                    ref={ref}
                    type="file"
                    onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}
                  /> */}
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={ref}
                    onChange={onSelectFile}
                  />
                </div>
                <p className="dark:text-slate-300 text-xs sm:text-sm text-slate-700">
                  Must be JPEG, PNG, or GIF and cannot exceed 2MB
                </p>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="flex flex-col gap-4 sm:gap-8">
            <h1 className="dark:text-slate-100 text-md sm:text-2xl font-semibold text-slate-700">Username</h1>

            {usernameMessage.type && (
              <CustomAlert type={usernameMessage.type} title={usernameMessage.title} body={usernameMessage.body} />
            )}

            <form className="flex gap-2 sm:gap-4 items-start" onSubmit={usernameHandleSubmit}>
              <div className="w-full">
                <CustomInput
                  value={usernameValues.username}
                  onChange={usernameHandleChange}
                  name={"username"}
                  type={"text"}
                  placeholder={"Your new username here"}
                  label={"Username"}
                  onBlur={usernameHandleBlur}
                  error={usernameTouched.username && usernameErrors.username}
                />
              </div>

              <div className="flex flex-col gap-1 items-start text-xs sm:text-sm">
                &nbsp;
                <CustomButton
                  type="submit"
                  loading={usernameIsSubmitting}
                  disabled={currentUser.displayName === usernameValues.username}
                  text="Save"
                  primary={true}
                />
              </div>
            </form>
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="flex flex-col gap-4 sm:gap-8">
            <h1 className="dark:text-slate-100 text-md sm:text-2xl font-semibold text-slate-700 flex items-center gap-4">
              Email
            </h1>

            {emailMessage.type && (
              <CustomAlert type={emailMessage.type} title={emailMessage.title} body={emailMessage.body} />
            )}

            <form className="flex gap-2 sm:gap-4 items-end" onSubmit={emailHandleSubmit}>
              <div className="w-full flex flex-col gap-4">
                <CustomInput
                  value={emailValues.password}
                  onChange={emailHandleChange}
                  name={"password"}
                  type={"password"}
                  placeholder={"Current password"}
                  label={"Current password"}
                  onBlur={emailHandleBlur}
                  error={emailTouched.password && emailErrors.password}
                />
                <CustomInput
                  value={emailValues.email}
                  onChange={emailHandleChange}
                  name={"email"}
                  type={"email"}
                  placeholder={"Your new email here"}
                  label={"Email"}
                  onBlur={emailHandleBlur}
                  error={emailTouched.email && emailErrors.email}
                />
              </div>

              <div>
                &nbsp;
                <CustomButton
                  type="submit"
                  loading={emailIsSubmitting}
                  disabled={currentUser.email === emailValues.email}
                  text="Save"
                  primary={true}
                />
                {emailTouched.email && emailErrors.email && <span>&nbsp;</span>}
              </div>
            </form>
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="flex flex-col gap-4 sm:gap-8">
            <h1 className="dark:text-slate-100 text-md sm:text-2xl font-semibold text-slate-700 flex items-center gap-4">
              Change password
            </h1>

            {passwordMessage.type && (
              <CustomAlert type={passwordMessage.type} title={passwordMessage.title} body={passwordMessage.body} />
            )}

            <form className="flex gap-2 sm:gap-4 items-end" onSubmit={passwordHandleSubmit}>
              <div className="w-full flex flex-col gap-4">
                <CustomInput
                  value={passwordValues.currentPassword}
                  onChange={passwordHandleChange}
                  name={"currentPassword"}
                  type={"password"}
                  placeholder={"Current password"}
                  label={"Current password"}
                  onBlur={passwordHandleBlur}
                  error={passwordTouched.currentPassword && passwordErrors.currentPassword}
                />
                <CustomInput
                  value={passwordValues.newPassword}
                  onChange={passwordHandleChange}
                  name={"newPassword"}
                  type={"password"}
                  placeholder={"Your super strong new password"}
                  label={"New password"}
                  onBlur={passwordHandleBlur}
                  error={passwordTouched.newPassword && passwordErrors.newPassword}
                />
              </div>

              <div className="flex flex-col gap-1 items-start text-xs sm:text-sm">
                &nbsp;
                <CustomButton type="submit" loading={passwordIsSubmitting} text="Save" primary={true} />
                {passwordTouched.newPassword && passwordErrors.newPassword && <span>&nbsp;</span>}
              </div>
            </form>
          </div>
        </SettingsCard>
      </div>
    </>
  );
};

export default Settings;
