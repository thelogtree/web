import React from "react";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { StylesType } from "src/utils/styles";

export const OAuthCallbackScreen = () => {
  return (
    <DynamicContainer innerStyle={{ paddingTop: "12%" }}>
      <label style={styles.title}>
        Please wait one moment while we finish connecting...
      </label>
    </DynamicContainer>
  );
};

const styles: StylesType = {
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
  },
};
