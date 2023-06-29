import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import ConnectIcon from "src/assets/connect.png";
import { Colors } from "src/utils/colors";

export const IntegrationsTab = () => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const pathname = usePathname();
  const integrationsPath = `/org/${organization?.slug}/integrations`;
  const isOnIntegrations = useMemo(() => {
    return pathname.includes(integrationsPath);
  }, [pathname]);

  const _goToIntegrationsScreen = () => history.push(integrationsPath);

  return (
    <button
      style={{
        ...styles.container,
        ...(isOnIntegrations && {
          backgroundColor: Colors.lightGray,
          cursor: "default",
        }),
      }}
      onClick={_goToIntegrationsScreen}
      disabled={isOnIntegrations}
      className="tab"
    >
      <img src={ConnectIcon} style={styles.icon} />
      <label
        style={{
          ...styles.tabTitle,
          ...(!isOnIntegrations && { cursor: "pointer" }),
        }}
      >
        Connections
      </label>
    </button>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    cursor: "pointer",
    outline: "none",
    border: "none",
    // borderBottomStyle: "solid",
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.lightGray,
    width: "100%",
    minHeight: 33,
    paddingLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  tabTitle: {
    fontSize: 14,
    paddingLeft: 6,
    color: Colors.black,
    fontWeight: 400,
  },
};
