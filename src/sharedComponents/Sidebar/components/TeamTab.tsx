import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import PersonIcon from "src/assets/person.png";
import { Colors } from "src/utils/colors";
import "../index.css";

export const TeamTab = () => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const pathname = usePathname();
  const teamPath = `/org/${organization?.slug}/team`;
  const isOnTeamTab = useMemo(() => {
    return pathname.includes(teamPath);
  }, [pathname]);

  const _goToTeamScreen = () => history.push(teamPath);

  return (
    <button
      style={{
        ...styles.container,
        ...(isOnTeamTab && {
          backgroundColor: Colors.lightGray,
          cursor: "default",
        }),
      }}
      onClick={_goToTeamScreen}
      disabled={isOnTeamTab}
      className="tab"
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
    fontWeight: 300,
  },
};
