import React from "react";
import { StylesType } from "src/utils/styles";
import BigGenieIcon from "src/assets/bigGenie.png";
import { Colors } from "src/utils/colors";

export const Placeholder = () => (
  <div style={styles.outerContainer}>
    <div style={styles.container}>
      {/* <img src={BigGenieIcon} style={styles.icon} /> */}
      <label style={styles.title}>Your Genie is ready ✨</label>
    </div>
  </div>
);

const styles: StylesType = {
  outerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 300,
    color: Colors.darkGray,
  },
};
