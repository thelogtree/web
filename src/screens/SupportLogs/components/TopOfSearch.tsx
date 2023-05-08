import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  numLogsText?: string;
};

export const TopOfSearch = ({ numLogsText }: Props) => (
  <div style={styles.container}>
    <label style={styles.title}>Genie</label>
    <label style={styles.desc}>Enter a user's email, get their actions.</label>
    <label style={styles.numLogsTotalText}>{numLogsText}</label>
  </div>
);

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 20,
    paddingTop: 60,
  },
  desc: {
    paddingBottom: 0,
    color: Colors.darkGray,
    fontSize: 15,
    paddingTop: 16,
  },
  numLogsTotalText: {
    paddingBottom: 0,
    color: Colors.gray,
    fontSize: 13,
    paddingTop: 16,
  },
  title: {
    fontWeight: 700,
    fontSize: 40,
    textAlign: "left",
    paddingRight: 6,
    background: "linear-gradient(268.45deg, #000000 30.54%, #424242 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
};
