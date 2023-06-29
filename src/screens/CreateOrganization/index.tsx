import React from "react";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { SignUpForm } from "./components/SignUpForm";
import { isMobile } from "react-device-detect";

export const CreateOrganizationScreen = () => (
  <DynamicContainer innerStyle={{ paddingTop: isMobile ? 120 : "9%" }}>
    <label style={styles.joiningText}>Create account</label>
    <label style={styles.joiningTextDesc}>
      Already used by dozens of Y Combinator founders.
    </label>
    <SignUpForm />
  </DynamicContainer>
);

const styles: StylesType = {
  container: {
    width: "95%",
    height: "100%",
  },
  joiningText: {
    fontSize: 26,
    color: Colors.black,
    textAlign: "center",
    width: "100%",
    fontWeight: 700,
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
