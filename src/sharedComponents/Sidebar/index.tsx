import React from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { constants } from "src/utils/constants";
import { StylesType } from "src/utils/styles";

import { ApiTab } from "./components/ApiTab";
import { Folders } from "./components/Folders";
import { SignedInOrganization } from "./components/SignedInOrganization";

export const Sidebar = () => {
  const organization = useSelector(getOrganization);
  return organization ? (
    <div style={styles.container}>
      <SignedInOrganization />
      <ApiTab />
      <Folders />
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
    height: "100%",
    backgroundColor: Colors.veryLightGray,
    width: constants.sidebarWidth,
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
  },
  orgName: {
    fontSize: 16,
    paddingTop: 25,
    paddingLeft: 20,
    fontWeight: 600,
  },
};
