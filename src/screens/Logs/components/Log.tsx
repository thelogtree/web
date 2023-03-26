import { LogDocument } from "logtree-types";
import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export type FrontendLog = {
  content: string;
  _id: string;
  createdAt: Date;
};

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
    padding: 20,
  },
  pre: {
    backgroundColor: Colors.veryLightGray,
    color: Colors.black,
    borderRadius: 4,
    padding: 10,
  },
};
