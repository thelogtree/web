import React from "react";
import { useFolderStats } from "../lib";
import ArrowUpIcon from "src/assets/arrowUp.png";
import ArrowDownIcon from "src/assets/arrowDown.png";
import { StylesType } from "src/utils/styles";
import { Tooltip } from "antd";

export const Stat = () => {
  const { percentageChange, timeInterval, extendedPhrasing, isLoading } =
    useFolderStats();

  return percentageChange && !isLoading ? (
    <Tooltip title={extendedPhrasing}>
      <div style={styles.container}>
        <img
          src={percentageChange > 0 ? ArrowUpIcon : ArrowDownIcon}
          style={styles.icon}
        />
        <label style={styles.percent}>
          {Math.abs(percentageChange)}% in the last {timeInterval}
        </label>
      </div>
    </Tooltip>
  ) : null;
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  percent: {
    fontSize: 14,
    paddingLeft: 6,
  },
};
