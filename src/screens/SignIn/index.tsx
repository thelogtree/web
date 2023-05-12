import React from "react";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { SignInForm } from "./components/SignInForm";
import LogtreeIcon from "src/assets/logtreeLogo192.png";
import { isMobile } from "react-device-detect";

export const SignInScreen = () => (
  <DynamicContainer innerStyle={{ paddingTop: isMobile ? "25%" : "12%" }}>
    <label style={styles.signInTitle}>Sign in</label>
    <label style={styles.signInDesc}>Your co-pilot is waiting for you.</label>
    <SignInForm />
  </DynamicContainer>
);

const styles: StylesType = {
  container: {
    width: "90%",
    height: "100%",
  },
  signInTitle: {
    fontSize: 26,
    color: Colors.black,
    textAlign: "center",
    width: "100%",
    fontWeight: 500,
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
