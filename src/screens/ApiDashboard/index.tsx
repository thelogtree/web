import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";
import { GenerateKeys } from "./components/GenerateKeys";
import { UsageInstructions } from "./components/UsageInstructions";
import { Billing } from "./components/Billing";
import { Intro } from "./components/Intro";
import { isMobile } from "react-device-detect";
import Swal from "sweetalert2";

export const ApiDashboardScreen = () => {
  const organization = useSelector(getOrganization);

  useEffect(() => {
    if (isMobile) {
      Swal.fire({
        title: "Please Use Desktop",
        text: `Our site is optimized for desktop. Head over to logtree.co on your computer for a much better experience!`,
        icon: "info",
      });
    }
  }, []);

  return organization ? (
    <div style={styles.container}>
      <label style={styles.title}>API Portal</label>
      <Intro />
      <UsageInstructions />
      <GenerateKeys />
      <Billing />
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
    padding: isMobile ? 20 : 90,
    ...(isMobile && { paddingTop: 60 }),
    overflowY: "scroll",
  },
  title: {
    fontWeight: 700,
    fontSize: 36,
    paddingBottom: 30,
  },
};
