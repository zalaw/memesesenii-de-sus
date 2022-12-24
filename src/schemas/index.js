import * as yup from "yup";

const usernameRules = /^[A-Za-z0-9]{3,16}$/;
const passwordRules = /^[A-Za-z0-9!@#$%^&*]{8,20}/;

export const signInSchema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("This field is required"),
  password: yup.string().required("This field is required"),
});

export const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username should be 3-16 characters and shouldn't include any special characters")
    .max(16, "Username should be 3-16 characters and shouldn't include any special characters")
    .matches(usernameRules, {
      message: "Username should be 3-16 characters and shouldn't include any special characters",
    })
    .required("This field is required"),
  email: yup.string().email("Email should be valid").required("This field is required"),
  password: yup
    .string()
    .min(8, "Password should be at 8-20 characters")
    .max(20, "Password should be at 8-20 characters")
    .matches(passwordRules, { message: "Password should be at 8-20 characters" })
    .required("This field is required"),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("This field is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("This field is required"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password should be at 8-20 characters")
    .max(20, "Password should be at 8-20 characters")
    .matches(passwordRules, { message: "Password should be at 8-20 characters" })
    .required("This field is required"),
});

export const changeUsernameSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username should be 3-16 characters and shouldn't include any special characters")
    .max(16, "Username should be 3-16 characters and shouldn't include any special characters")
    .matches(usernameRules, {
      message: "Username should be 3-16 characters and shouldn't include any special characters",
    })
    .required("This field is required"),
});

export const changeEmailSchema = yup.object().shape({
  password: yup.string().required("This field is required"),
  email: yup.string().email("Email should be valid").required("This field is required"),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("This field is required"),
  newPassword: yup
    .string()
    .min(8, "Password should be at 8-20 characters")
    .max(20, "Password should be at 8-20 characters")
    .matches(passwordRules, { message: "Password should be at 8-20 characters" })
    .required("This field is required"),
});
