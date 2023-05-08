import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import GenieIcon from "src/assets/genie.png";
import { Colors } from "src/utils/colors";
import { SUPPORT_TOOL_SUFFIX } from "src/RouteManager";

export const SupportSearchTab = () => {
  const organization = useSelector(getOrganization);
  const pathname = usePathname();
  const globalSearchPath = `/org/${organization?.slug}${SUPPORT_TOOL_SUFFIX}`;
  const isOnGlobalSearch = useMemo(() => {
    return pathname.includes(globalSearchPath);
  }, [pathname]);

  const _goToGlobalSearchScreen = () => window.open(globalSearchPath, "_blank");

  return (
    <button
      style={styles.container}
      onClick={_goToGlobalSearchScreen}
      disabled={isOnGlobalSearch}
      className="tab"
    >
      <img src={GenieIcon} style={styles.icon} />
      <label style={styles.tabTitle}>Launch Genie</label>
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
    cursor: "pointer",
  },
  tabTitle: {
    fontSize: 14,
    paddingLeft: 6,
    color: Colors.black,
    fontWeight: 300,
    cursor: "pointer",
  },
};
