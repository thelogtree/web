import React from "react";
import { useSelector } from "react-redux";
import { getDashboards } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { DashboardPicker } from "./DashboardPicker";
import { ToggleAddWidgetMode } from "./ToggleAddWidgetMode";
import { RefreshButton } from "src/screens/Dashboard/components/RefreshButton";

export const HeaderBar = () => {
  const dashboards = useSelector(getDashboards);

  if (!dashboards.length) {
    return <div style={styles.container} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <DashboardPicker />
        <RefreshButton />
      </div>
      <ToggleAddWidgetMode />
    </div>
  );
};

const styles: StylesType = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.black,
    zIndex: 30,
    paddingLeft: 20,
  },
  leftSide: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};
