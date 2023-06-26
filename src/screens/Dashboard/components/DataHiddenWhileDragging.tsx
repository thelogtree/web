import React from "react";
import { StylesType } from "src/utils/styles";

export const DataHiddenWhileDragging = () => (
  <div style={styles.container}>
    <label style={styles.dataIsHidden}>
      Data is hidden while moving the widget.
    </label>
  </div>
);

const styles: StylesType = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 40,
  },
  dataIsHidden: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
};
