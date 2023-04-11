import React from "react";
import { useFolderStats } from "../lib";
import ArrowUpIcon from "src/assets/arrowUp.png";
import ArrowDownIcon from "src/assets/arrowDown.png";
import { StylesType } from "src/utils/styles";
import { Tooltip } from "antd";
import { MiniGraph } from "./MiniGraph";
import { Colors } from "src/utils/colors";

type Props = {
  numLogs: number; // only used to determine when to refetch folder stats
};

export const Stat = ({ numLogs }: Props) => {
  const { logFrequencies, numLogsToday } = useFolderStats(numLogs);

  return logFrequencies.length /* || percentageChange*/ ? (
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
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    padding: 8,
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
