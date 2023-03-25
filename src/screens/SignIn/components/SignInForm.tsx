import React, { useState } from "react";
import { showGenericErrorAlert } from "src/utils/helpers";
import firebase from "../../../firebaseConfig";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { SharedStyles, StylesType } from "src/utils/styles";

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    backgroundColor: Colors.white,
    padding: 32,
    boxShadow: "0px 12px 10px rgba(0,0,0,0.1)",
  },
  input: {
    backgroundColor: Colors.veryLightGray,
    borderRadius: 4,
    outline: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    width: "100%",
    height: 35,
    paddingLeft: 8,
  },
  inputTitle: {
    paddingBottom: 10,
    fontWeight: 400,
  },
  signInBtn: {
    outline: "none",
    borderRadius: 4,
    backgroundColor: Colors.blue800,
    border: "none",
    width: "100%",
    marginTop: 30,
    height: 40,
    color: Colors.white,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};
