import React, { useRef, useState } from "react";
import SettingsCard from "../components/SettingsCard";
import UserAvatar from "../components/UserAvatar";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../contexts/AuthContext";
import CustomAlert from "../components/CustomAlert";
import ImagePreview from "../components/ImagePreview";
import { useFormik } from "formik";
import { changeUsernameSchema, changeEmailSchema, changePasswordSchema, deleteAccountSchema } from "../schemas";
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { deleteUser } from "firebase/auth";

const Settings = () => {
  const { currentUser, setCurrentUser, updateDisplayName, verifyThenUpdateEmail, reauthenticate, updateUsersPassword } =
    useAuth();

  const [imageMessage, setImageMessage] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [imgSrc, setImgSrc] = useState("");

  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

  const buttonRef = useRef(null);

  function onSelectFile(e) {
    if (!(e.target.files && e.target.files.length > 0)) return;

    const file = e.target.files[0];

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

    setImageMessage(null);

    const reader = new FileReader();
    reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
    reader.readAsDataURL(file);
  }

  const usernameOnSubmit = async (values, actions) => {
    setUsernameMessage(null);

    try {
      await updateDisplayName(values.username);
      await setDoc(doc(db, "users", currentUser.uid), { displayName: values.username }, { merge: true });

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
    setEmailMessage(null);

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
    setPasswordMessage(null);

    if (values.currentPassword === values.newPassword)
      return setPasswordMessage({
        type: "error",
        title: "Password change failed",
        body: "Passwords cannot be the same",
      });

    try {
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

  const deleteAccountOnSubmit = async (values, actions) => {
    setDeleteMessage(null);

    try {
      await reauthenticate(currentUser.email, values.deleteCurrentPassword);

      console.log(currentUser);

      const avatarRef = ref(storage, `avatars/${currentUser.uid}/${currentUser.photoName}`);
      if (avatarRef.name !== "null") await deleteObject(avatarRef);

      for (const postedMeme of currentUser.postedMemes) {
        const memeRef = ref(storage, `memes/${postedMeme.name}`);
        if (memeRef.name !== "null") await deleteObject(memeRef);

        await deleteDoc(postedMeme.ref);
      }

      console.log("am ajuns aici");

      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(auth.currentUser);

      actions.resetForm();
    } catch (err) {
      console.log(err);
      if (err.code === "auth/wrong-password")
        setDeleteMessage({
          type: "error",
          title: "Deletion failed",
          body: "The password is incorrect, c'mon bruh, it's your password after all",
        });
      else setDeleteMessage({ type: "error", title: "Unknown error" });
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

  const {
    values: deleteValues,
    errors: deleteErrors,
    touched: deleteTouched,
    isSubmitting: deleteIsSubmitting,
    handleBlur: deleteHandleBlur,
    handleChange: deleteHandleChange,
    handleSubmit: deleteHandleSubmit,
  } = useFormik({
    initialValues: {
      deleteCurrentPassword: "",
    },
    validationSchema: deleteAccountSchema,
    onSubmit: deleteAccountOnSubmit,
  });

  return (
    <>
      {imgSrc && (
        <ImagePreview
          src={imgSrc}
          handleClose={() => {
            setImgSrc("");
            buttonRef.current.value = "";
          }}
        />
      )}

      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <SettingsCard>
          <div className="flex flex-col gap-4 sm:gap-8">
            <h1 className="dark:text-slate-100 text-md sm:text-2xl font-semibold text-slate-700">Profile picture</h1>

            {imageMessage && (
              <CustomAlert type={imageMessage.type} title={imageMessage.title} body={imageMessage.body} />
            )}

            <div className="flex gap-4 items-center">
              <UserAvatar photoURL={currentUser.photoURL} className="w-20 aspect-square" />
              <div className="flex flex-col gap-2 items-start">
                <CustomButton
                  text={"Upload profile picture"}
                  primary={true}
                  onClick={() => buttonRef.current.click()}
                />
                <div className="w-0 h-0 hidden">
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={buttonRef}
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

            {usernameMessage && (
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
                  className="w-[4rem]"
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

            {emailMessage && (
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
                  className="w-[4rem]"
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

            {passwordMessage && (
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
                <CustomButton
                  type="submit"
                  loading={passwordIsSubmitting}
                  text="Save"
                  primary={true}
                  className="w-[4rem]"
                />
                {passwordTouched.newPassword && passwordErrors.newPassword && <span>&nbsp;</span>}
              </div>
            </form>
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="flex flex-col gap-4 sm:gap-8">
            <h1 className="text-md sm:text-2xl font-semibold flex items-center gap-4 text-red-600">Delete account</h1>

            <div className="flex flex-col gap-2 sm:gap-4 md:text-sm text-xs">
              <p>
                Once you delete your account, there is no going back. You will lose everything you possess. Please be
                certain.
              </p>
            </div>

            {deleteMessage && (
              <CustomAlert type={deleteMessage.type} title={deleteMessage.title} body={deleteMessage.body} />
            )}

            <form className="flex gap-2 sm:gap-4 items-start" onSubmit={deleteHandleSubmit}>
              <div className="w-full">
                <CustomInput
                  value={deleteValues.deleteCurrentPassword}
                  onChange={deleteHandleChange}
                  name={"deleteCurrentPassword"}
                  type={"password"}
                  placeholder={"Current password"}
                  label={"Current password"}
                  onBlur={deleteHandleBlur}
                  error={deleteTouched.deleteCurrentPassword && deleteErrors.deleteCurrentPassword}
                />
              </div>

              <div className="flex flex-col gap-1 items-start text-xs sm:text-sm">
                &nbsp;
                <CustomButton
                  className="danger-button bg-red-700 font-semibold hover:bg-red-500 dark:hover:bg-red-500 w-[4rem]"
                  type="submit"
                  loading={deleteIsSubmitting}
                  disabled={deleteValues.deleteCurrentPassword.length === 0}
                  text="Delete"
                />
              </div>
            </form>
          </div>
        </SettingsCard>
      </div>
    </>
  );
};

export default Settings;
