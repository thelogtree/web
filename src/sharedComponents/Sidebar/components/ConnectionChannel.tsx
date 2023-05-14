import { integrationTypeEnum } from "logtree-types";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ConnectionIcon from "src/assets/connectionLink.png";
import { getOrganization } from "src/redux/organization/selector";
import { CONNECTION_ROUTE_PREFIX } from "src/RouteManager";
import { IntegrationsToConnectToMap } from "src/screens/Integrations/integrationsToConnectTo";
import { useConnectionPathFromUrl } from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  integrationType: integrationTypeEnum;
  hasTopBorder?: boolean;
};

export const ConnectionChannel = ({ integrationType, hasTopBorder }: Props) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const connectionPath = useConnectionPathFromUrl();
  const isSelected = integrationType === connectionPath;

  const _onPress = () => {
    if (!isSelected) {
      history.push(
        `/org/${organization?.slug}${CONNECTION_ROUTE_PREFIX}/${integrationType}`
      );
      return;
    }
  };

  return (
    <button
      style={{
        ...styles.container,
        ...(hasTopBorder && styles.topBorder),
        ...((isHovering || isSelected) && {
          backgroundColor: Colors.lightGray,
        }),
        ...(isSelected && { cursor: "default" }),
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={_onPress}
    >
      <img
        src={ConnectionIcon}
        style={{ ...styles.icon, ...(isSelected && { cursor: "auto" }) }}
      />
      <label
        style={{
          ...styles.name,
          ...(isSelected && { cursor: "auto" }),
        }}
      >
        {IntegrationsToConnectToMap[integrationType].prettyName}
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
    width: "100%",
    height: 33,
    backgroundColor: Colors.transparent,
    outline: "none",
    border: "none",
    // borderBottomColor: Colors.lightGray,
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    cursor: "pointer",
    paddingLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  name: {
    paddingLeft: 6,
    cursor: "pointer",
    paddingRight: 6,
    fontSize: 14,
    fontWeight: 300,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  topBorder: {
    // borderTopStyle: "solid",
    // borderTopWidth: 1,
    // borderTopColor: Colors.lightGray,
  },
  hasUnreadLogs: {
    fontWeight: 700,
  },
};
