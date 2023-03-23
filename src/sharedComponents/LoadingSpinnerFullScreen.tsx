import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { StylesType } from "src/utils/styles";

export const LoadingSpinnerFullScreen = () => (
  <div style={styles.container}>
    <LoadingSpinner />
  </div>
);

const styles: StylesType = {
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
