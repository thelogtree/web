import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const LogsAfterTodayNote = () => (
  <div style={styles.container}>
    <hr style={styles.hr} />
    <label style={styles.text}>No more events from today</label>
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
    paddingTop: 30,
    paddingBottom: 45,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    height: 1,
    width: "50%",
    border: "none",
  },
  text: {
    paddingLeft: 6,
    paddingRight: 6,
    color: Colors.gray,
    textAlign: "center",
    fontSize: 14,
    minWidth: 220,
  },
};
