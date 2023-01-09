import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  confirmPasswordReset,
  sendEmailVerification,
  applyActionCode,
  verifyBeforeUpdateEmail,
  updateCurrentUser,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { query, where, collection, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  function updateDisplayName(name) {
    return updateProfile(auth.currentUser, { displayName: name });
  }

  function sendVerificationEmail() {
    return sendEmailVerification(auth.currentUser);
  }

  function verifyEmail(oobCode) {
    return applyActionCode(auth, oobCode);
  }

  function reloadUser() {
    return auth.currentUser.reload();
  }

  function verifyThenUpdateEmail(newEmail) {
    return verifyBeforeUpdateEmail(auth.currentUser, newEmail);
  }

  function refreshUser() {
    return updateCurrentUser(auth, auth.currentUser);
  }

  function updateUsersEmail(newEmail) {
    return updateEmail(auth.currentUser, newEmail);
  }

  function reauthenticate(email, password) {
    return reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(email, password));
  }

  function updateUsersPassword(newPassword) {
    return updatePassword(auth.currentUser, newPassword);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user && user.emailVerified) {
        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("userId", "==", auth.currentUser.uid))
        );

        setCurrentUser({
          uid: user.uid,
          firestoreId: querySnapshot.docs[0].id,
          avatarFileName: querySnapshot.docs[0].data().avatarFileName,
          photoURL: user.photoURL,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
        });
      } else setCurrentUser(null);

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    signup,
    signin,
    logout,
    forgotPassword,
    resetPassword,
    updateDisplayName,
    sendVerificationEmail,
    verifyEmail,
    reloadUser,
    verifyThenUpdateEmail,
    refreshUser,
    updateUsersEmail,
    reauthenticate,
    updateUsersPassword,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
