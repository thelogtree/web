import React from "react";
import { useSelector } from "react-redux";
import { getDashboards } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";

export const HeaderBar = () => {
  const dashboards = useSelector(getDashboards);

  if (!dashboards.length) {
    return <div style={styles.container} />;
  }

  return <div style={styles.container}></div>;
};

const styles: StylesType = {
  container: {
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
