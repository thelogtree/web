import React, { useState } from "react";
import { showGenericErrorAlert } from "src/utils/helpers";
import firebase from "../../../firebaseConfig";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { SharedStyles, StylesType } from "src/utils/styles";
import Swal from "sweetalert2";

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoadingResetPassword, setIsLoadingResetPassword] =
    useState<boolean>(false);

  const _submitForm = async () => {
    try {
      if (!email || !password) {
        throw new Error("Please fill in all the details.");
      }
      setIsLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      showGenericErrorAlert({
        message: "The email or password you entered is incorrect.",
      });
      setIsLoading(false); // this must stay only in the catch
    }
  };

  const _resetPassword = async () => {
    if (!email) {
      Swal.fire({
        title: "Enter email",
        text: "Please enter the email of your account first, then click the reset password button again.",
        icon: "info",
      });
      return;
    }
    try {
      setIsLoadingResetPassword(true);
      await firebase.auth().sendPasswordResetEmail(email);
      Swal.fire({
        title: "Sent email",
        text: `We just sent an email to ${email} with instructions on how to reset your password.`,
        icon: "info",
      });
    } catch (e) {
      showGenericErrorAlert({ message: "No account with this email exists." });
    }
    setIsLoadingResetPassword(false);
  };

  return (
    <div style={styles.container}>
      <label style={styles.inputTitle}>Email</label>
      <input
        placeholder="john@companyname.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <label style={{ ...styles.inputTitle, paddingTop: 24 }}>Password</label>
      <input
        placeholder="Secret"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        style={styles.input}
        autoComplete="new-password"
      />
      <button
        style={styles.resetPasswordBtn}
        onClick={_resetPassword}
        disabled={isLoadingResetPassword}
      >
        {isLoadingResetPassword
          ? "One moment..."
          : "Forgot your password? Click here to reset it."}
      </button>
      <button
        style={{
          ...styles.signInBtn,
          ...(isLoading && SharedStyles.loadingButton),
        }}
        onClick={_submitForm}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingSpinner
            size={16}
            color={Colors.white}
            style={{ marginRight: 12 }}
          />
        ) : null}
        Sign in
      </button>
    </div>
  );
};

const styles: StylesType = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: Colors.lightGray,
    // borderStyle: "solid",
    // backgroundColor: Colors.white,
    paddingTop: 30,
    paddingBottom: 30,
    // boxShadow: "0px 12px 10px rgba(0,0,0,0.1)",
  },
  input: {
    backgroundColor: Colors.veryLightGray,
    borderRadius: 4,
    outline: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    width: "100%",
    height: 45,
    paddingLeft: 10,
  },
  inputTitle: {
    paddingBottom: 6,
    fontWeight: 400,
    color: Colors.darkerGray,
    fontSize: 13,
  },
  signInBtn: {
    outline: "none",
    borderRadius: 30,
    backgroundColor: Colors.black,
    border: "none",
    width: "100%",
    marginTop: 20,
    height: 50,
    color: Colors.white,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resetPasswordBtn: {
    outline: "none",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
    textAlign: "left",
    color: Colors.gray,
    fontSize: 12,
    marginTop: 12,
    position: "relative",
    right: 5,
  },
};
