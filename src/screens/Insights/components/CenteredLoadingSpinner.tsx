import React from "react";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { StylesType } from "src/utils/styles";

export const CenteredLoadingSpinner = () => (
  <div style={styles.container}>
    <LoadingSpinner size={40} />
  </div>
);

const styles: StylesType = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
