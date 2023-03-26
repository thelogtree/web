import React from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";
import { GenerateKeys } from "./components/GenerateKeys";
import { UsageInstructions } from "./components/UsageInstructions";

export const ApiDashboardScreen = () => {
  const organization = useSelector(getOrganization);
  return organization ? (
    <div style={styles.container}>
      <label style={styles.title}>API Dashboard</label>
      <GenerateKeys />
      <UsageInstructions />
    </div>
  ) : (
    <LoadingSpinnerFullScreen />
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    position: "relative",
    padding: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    paddingBottom: 40,
  },
};
