import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkTheme: localStorage.getItem("MDS_DARK_THEME") === "true",
  userAreaLoading: true,
  showSignInModal: false,
  showSignUpModal: false,
  showForgotPasswordModal: false,
  showResetPasswordModal: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDarkTheme: (state, action) => {
      state.darkTheme = action.payload;
    },
    setUserAreaLoading: (state, action) => {
      state.userAreaLoading = action.payload;
    },
    setShowSignInModal: (state, action) => {
      state.showSignInModal = action.payload;
    },
    setShowSignUpModal: (state, action) => {
      state.showSignUpModal = action.payload;
    },
    setShowForgotPasswordModal: (state, action) => {
      state.showForgotPasswordModal = action.payload;
    },
    setShowResetPasswordModal: (state, action) => {
      state.showResetPasswordModal = action.payload;
    },
  },
});

export const {
  setDarkTheme,
  setUserAreaLoading,
  setShowSignInModal,
  setShowSignUpModal,
  setShowForgotPasswordModal,
  setShowResetPasswordModal,
} = uiSlice.actions;

export default uiSlice.reducer;
