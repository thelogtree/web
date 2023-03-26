import React from "react";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { StylesType } from "src/utils/styles";

export const LoadingLogs = () => (
  <div style={styles.loadingContainer}>
    <LoadingSpinner size={40} />
  </div>
);

const styles: StylesType = {
  loadingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingTop: 200,
  },
};
