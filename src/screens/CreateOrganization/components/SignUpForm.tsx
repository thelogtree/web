import firebase from "../../../firebaseConfig";
import React, { useState } from "react";
import { Api } from "src/api";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");

  const _submitForm = async () => {
    try {
      if (!email || !password || !organizationName) {
        throw new Error("Please fill in all the details.");
      }
      if (password.length < 6) {
        throw new Error("Your password must be at least 6 characters long.");
      }
      setIsLoading(true);
      await Api.organization.createAccountAndOrganization(
        organizationName,
        email,
        password,
        promoCode
      );
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      showGenericErrorAlert(e);
      setIsLoading(false); // this must stay only in the catch
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.inputTitle}>Company name</label>
      <input
        placeholder="Robinhood"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.target.value)}
        style={styles.input}
      />
      <label style={{ ...styles.inputTitle, paddingTop: 24 }}>Work email</label>
      <input
        placeholder="john@companyname.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <label style={{ ...styles.inputTitle, paddingTop: 24 }}>
        Set password
      </label>
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        style={styles.input}
        autoComplete="new-password"
      />
      <label style={{ ...styles.inputTitle, paddingTop: 24 }}>
        Promo code (optional)
      </label>
      <input
        placeholder=""
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        style={styles.input}
      />
      <button
        style={{
          ...styles.joinTeamBtn,
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
        Create free account
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
    paddingTop: 30,
    paddingBottom: 30
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
  joinTeamBtn: {
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
};
