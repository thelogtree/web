import React from "react";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { SignInForm } from "./components/SignInForm";
import { isMobile } from "react-device-detect";

export const SignInScreen = () => (
  <DynamicContainer innerStyle={{ paddingTop: isMobile ? 120 : "12%" }}>
    <label style={styles.signInTitle}>Sign in</label>
    <label style={styles.signInDesc}>We kept everything tidy for you.</label>
    <SignInForm />
  </DynamicContainer>
);

const styles: StylesType = {
  container: {
    width: "95%",
    height: "100%",
  },
  signInTitle: {
    fontSize: 26,
    color: Colors.black,
    textAlign: "center",
    width: "100%",
    fontWeight: 700,
  },
  signInDesc: {
    fontSize: 15,
    color: Colors.darkerGray,
    paddingTop: 10,
    paddingBottom: 30,
    textAlign: "center",
    width: "100%",
    fontWeight: 300,
  },
};
