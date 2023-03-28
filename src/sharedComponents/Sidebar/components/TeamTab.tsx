import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import PersonIcon from "src/assets/person.png";
import { Colors } from "src/utils/colors";

export const TeamTab = () => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const pathname = usePathname();
  const isOnTeamTab = pathname.includes(`/org/${organization?.slug}/team`);

  const _goToTeamScreen = () => history.push(`/org/${organization?.slug}/team`);

  return (
    <button
      style={{
        ...styles.container,
        ...(isOnTeamTab && {
          backgroundColor: Colors.lightGray,
          cursor: "auto",
        }),
      }}
      onClick={_goToTeamScreen}
      disabled={isOnTeamTab}
    >
      <img src={PersonIcon} style={styles.icon} />
      <label
        style={{
          ...styles.tabTitle,
          ...(!isOnTeamTab && { cursor: "pointer" }),
        }}
      >
        Team Members
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
    paddingLeft: 6,
    color: Colors.black,
  },
};
