import React from "react";
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
  const isOnApiDashboard = pathname.includes("/api-dashboard");

  const _goToApiScreen = () =>
    history.push(`/org/${organization?.slug}/api-dashboard`);

  return (
    <button
      style={{
        ...styles.container,
        ...(isOnApiDashboard && {
          backgroundColor: Colors.lightGray,
          cursor: "auto",
        }),
      }}
      onClick={_goToApiScreen}
      disabled={isOnApiDashboard}
    >
      <img src={NotebookIcon} style={styles.icon} />
      <label
        style={{
          ...styles.tabTitle,
          ...(!isOnApiDashboard && { cursor: "pointer" }),
        }}
      >
        API Dashboard
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
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.transparent,
    width: "100%",
    height: 40,
    minHeight: 40,
    paddingLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  tabTitle: {
    fontSize: 15,
    paddingLeft: 10,
    color: Colors.black,
  },
};
