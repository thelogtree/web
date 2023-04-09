import React from "react";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { SignInForm } from "./components/SignInForm";

export const SignInScreen = () => (
  <DynamicContainer innerStyle={{ paddingTop: "12%" }}>
    <label style={styles.signInTitle}>Sign in to Logtree</label>
    <SignInForm />
  </DynamicContainer>
);

const styles: StylesType = {
  container: {
    width: "90%",
    height: "100%",
  },
  signInTitle: {
    fontSize: 30,
    color: Colors.black,
    paddingBottom: 40,
    textAlign: "center",
    width: "100%",
    fontWeight: 300,
  },
};
