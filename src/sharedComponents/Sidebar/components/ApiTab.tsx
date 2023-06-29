import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import NotebookIcon from "src/assets/notebook.png";
import { Colors } from "src/utils/colors";

export const ApiTab = () => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const pathname = usePathname();
  const apiPath = `/org/${organization?.slug}/api-dashboard`;
  const isOnApiDashboard = useMemo(() => {
    return pathname.includes(apiPath);
  }, [pathname]);

  const _goToApiScreen = () => history.push(apiPath);

  return (
    <button
      style={{
        ...styles.container,
        ...(isOnApiDashboard && {
          backgroundColor: Colors.lightGray,
          cursor: "default",
        }),
      }}
      onClick={_goToApiScreen}
      disabled={isOnApiDashboard}
      className="tab"
    >
      <img src={NotebookIcon} style={styles.icon} />
      <label
        style={{
          ...styles.tabTitle,
          ...(!isOnApiDashboard && { cursor: "pointer" }),
        }}
      >
        API Portal
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
