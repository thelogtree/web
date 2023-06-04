import React from "react";
import { StylesType } from "src/utils/styles";
import { MiniGraph } from "./MiniGraph";
import { Colors } from "src/utils/colors";

type Props = {
  numLogsToday: number;
  logFrequencies: number[];
};

export const Stat = ({ numLogsToday, logFrequencies }: Props) => {
  return logFrequencies.length ? (
    <div style={styles.outerContainer}>
      <MiniGraph logFrequencies={logFrequencies} numLogsToday={numLogsToday} />
    </div>
  ) : null;
};

const styles: StylesType = {
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 18,
    height: 18,
  },
  percent: {
    fontSize: 13,
  },
};
