import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const LogsAfterTodayNote = () => (
  <div style={styles.container}>
    <hr style={styles.hr} />
    <label style={styles.text}>No more logs from today</label>
    <hr style={styles.hr} />
  </div>
);

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 18,
    paddingBottom: 25,
  },
  hr: {
    backgroundColor: Colors.gray,
    height: 1,
    width: "36%",
    border: "none",
  },
  text: {
    paddingLeft: 6,
    paddingRight: 6,
    color: Colors.darkGray,
    textAlign: "center",
    fontSize: 14,
  },
};
