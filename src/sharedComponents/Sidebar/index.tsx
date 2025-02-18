import React from "react";
import { useSelector } from "react-redux";
import {
  getIntegrations,
  getOrganization,
  getSidebarWidth,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { ApiTab } from "./components/ApiTab";
import { FavoritesTab } from "./components/FavoritesTab";
import { Folders } from "./components/Folders";
import { InsightsTab } from "./components/InsightsTab";
import { SignedInOrganization } from "../../screens/SupportLogs/components/SignedInOrganization";
import { Resizer } from "./components/Resizer";
import { SupportSearchTab } from "./components/SupportSearchTab";
import { IntegrationsTab } from "./components/IntegrationsTab";
import { Connections } from "./components/Connections";
import { GlobalSearchTab } from "./components/GlobalSearchTab";
import { FunnelsTab } from "./components/FunnelsTab";
import { DashboardTab } from "./components/DashboardTab";

export const Sidebar = () => {
  const integrations = useSelector(getIntegrations);
  const sidebarWidth = useSelector(getSidebarWidth);
  const organization = useSelector(getOrganization);

  return organization ? (
    <div style={{ ...styles.container, width: sidebarWidth }}>
      <div style={styles.innerContainer}>
        <SignedInOrganization />
        <ApiTab />
        <FavoritesTab />
        {/* <InsightsTab /> */}
        <FunnelsTab />
        <IntegrationsTab />
        <GlobalSearchTab />
        <DashboardTab />
        {integrations.length ? <SupportSearchTab /> : null}
        {/* <Connections /> */}
        <Folders />
      </div>
      <Resizer />
    </div>
  ) : (
    <div style={styles.container} />
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.veryLightGray,
    // borderRightStyle: "solid",
    // borderRightWidth: 1,
    // borderRightColor: Colors.lightGray,
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 5,
    overflowY: "hidden",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    overflowY: "scroll",
  },
  orgName: {
    fontSize: 16,
    paddingTop: 25,
    paddingLeft: 20,
    fontWeight: 600,
  },
};
