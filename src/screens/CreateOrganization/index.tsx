import React from "react";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { SignUpForm } from "./components/SignUpForm";

export const CreateOrganizationScreen = () => (
  <DynamicContainer innerStyle={{ paddingTop: "9%" }}>
    <label style={styles.joiningText}>Create account</label>
    <label style={styles.joiningTextDesc}>
      Start debugging 10x faster today.
    </label>
    <SignUpForm />
  </DynamicContainer>
);

const styles: StylesType = {
  container: {
    width: "90%",
    height: "100%",
  },
  joiningText: {
    fontSize: 26,
    color: Colors.black,
    textAlign: "center",
    width: "100%",
    fontWeight: 500,
  },
  joiningTextDesc: {
    fontSize: 15,
    color: Colors.darkerGray,
    paddingTop: 10,
    paddingBottom: 30,
    textAlign: "center",
    width: "100%",
    fontWeight: 300,
  },
};
