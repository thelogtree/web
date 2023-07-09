import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const ManageConnectionsButton = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const _goToIntegrationsScreen = () =>
    history.push(`/org/${organization?.slug}/integrations`);

  return (
    <button style={styles.container} onClick={_goToIntegrationsScreen}>
      Manage integrations
    </button>
  );
};

const styles: StylesType = {
  container: {
    fontSize: 14,
    fontWeight: 500,
    color: Colors.darkGray,
    cursor: "pointer",
    outline: "none",
    backgroundColor: Colors.transparent,
    border: "none",
  },
};
