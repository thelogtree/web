import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { ORG_ROUTE_PREFIX } from "src/RouteManager";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import HomeIcon from "src/assets/homeWhite.png";

export const HomeButton = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);

  if (!organization) {
    return null;
  }

  const _navigate = () =>
    history.push(`${ORG_ROUTE_PREFIX}/${organization.slug}/favorites`);

  return (
    <button style={styles.homeBtn} onClick={_navigate}>
      <img src={HomeIcon} style={styles.icon} />
    </button>
  );
};

const styles: StylesType = {
  homeBtn: {
    cursor: "pointer",
    outline: "none",
    color: Colors.white,
    backgroundColor: Colors.transparent,
    border: "none",
    marginRight: 14,
  },
  icon: {
    width: 24,
    height: 24,
    cursor: "pointer",
  },
};
