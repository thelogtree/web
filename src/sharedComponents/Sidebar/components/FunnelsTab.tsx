import "../index.css";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FunnelIcon from "src/assets/funnel.png";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export const FunnelsTab = () => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const pathname = usePathname();
  const funnelsPath = `/org/${organization?.slug}/funnels`;
  const isSelected = useMemo(() => {
    return pathname.includes(funnelsPath);
  }, [pathname]);

  const _goToFunnels = () => history.push(funnelsPath);

  return (
    <button
      style={{
        ...styles.container,
        ...(isSelected && {
          backgroundColor: Colors.lightGray,
          cursor: "default",
        }),
      }}
      onClick={_goToFunnels}
      disabled={isSelected}
      className="tab"
    >
      <img src={FunnelIcon} style={styles.icon} />
      <label
        style={{
          ...styles.tabTitle,
          ...(!isSelected && { cursor: "pointer" }),
        }}
      >
        Funnels
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
