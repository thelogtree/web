import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const DeletedLogRedBox = () => (
  <div style={styles.container}>
    <label style={styles.label}>This log has been deleted.</label>
  </div>
);

const styles: StylesType = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: Colors.red,
    borderStyle: "solid",
    backgroundColor: "#ffe3e3",
    color: Colors.red,
    borderRadius: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: Colors.red,
    fontSize: 15,
    fontFamily: "Inter",
  },
};
