import React from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";
import { GenerateKeys } from "./components/GenerateKeys";
import { UsageInstructions } from "./components/UsageInstructions";
import { Billing } from "./components/Billing";
import { Intro } from "./components/Intro";

export const ApiDashboardScreen = () => {
  const organization = useSelector(getOrganization);
  return organization ? (
    <div style={styles.container}>
      <label style={styles.title}>API Dashboard</label>
      <Intro />
      <Billing />
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
    padding: 90,
    overflowY: "scroll",
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
    paddingBottom: 40,
  },
};
