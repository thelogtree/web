import React from "react";
import { Insight } from "../lib";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import ArrowUpIcon from "src/assets/arrowUp.png";
import ArrowDownIcon from "src/assets/arrowDown.png";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";

type Props = {
  insight: Insight;
};

export const InsightItem = ({ insight }: Props) => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const _goToChannel = () => {
    history.push(
      `/org/${organization?.slug}${LOGS_ROUTE_PREFIX}${insight.folder.fullPath}`
    );
  };

  return (
    <button
      style={styles.container}
      onClick={_goToChannel}
      className="insightItem"
    >
      <label style={styles.folderName}>{insight.folder.name}</label>
      <label style={styles.fullPath}>{insight.folder.fullPath}</label>
      <div style={styles.bottomContainer}>
        <img
          src={insight.stat.percentageChange > 0 ? ArrowUpIcon : ArrowDownIcon}
          style={styles.icon}
        />
        <label style={styles.percent}>
          {Math.abs(insight.stat.percentageChange)}% in the last{" "}
          {insight.stat.timeInterval}
        </label>
      </div>
    </button>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    width: "100%",
    height: 120,
    marginBottom: 20,
    boxShadow: "2px 2px 6px rgba(0,0,0,0.05)",
    outline: "none",
    cursor: "pointer",
  },
  folderName: {
    fontSize: 15,
    fontWeight: 500,
    paddingBottom: 8,
    cursor: "pointer",
  },
  fullPath: {
    fontSize: 12,
    paddingBottom: 14,
    color: Colors.gray,
    cursor: "pointer",
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  percent: {
    fontSize: 16,
    paddingLeft: 6,
    fontWeight: 500,
    cursor: "pointer",
  },
};
