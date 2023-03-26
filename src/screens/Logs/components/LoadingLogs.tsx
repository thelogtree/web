import React from "react";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { StylesType } from "src/utils/styles";

export const LoadingLogs = () => (
  <div style={styles.loadingContainer}>
    <LoadingSpinner size={30} />
  </div>
);

const styles: StylesType = {
  loadingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: 20,
    paddingLeft: 50,
  },
};
