import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { FrontendLog } from "../lib";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => (
  <div style={styles.container}>
    <pre style={styles.pre}>{log.content}</pre>
  </div>
);

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 8,
  },
  pre: {
    backgroundColor: Colors.veryLightGray,
    color: Colors.black,
    borderRadius: 4,
    padding: 15,
    fontSize: 13,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
  },
};
