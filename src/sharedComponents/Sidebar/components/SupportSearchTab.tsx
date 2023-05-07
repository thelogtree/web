import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import SearchIcon from "src/assets/search.png";
import { Colors } from "src/utils/colors";

export const SupportSearchTab = () => {
  const organization = useSelector(getOrganization);
  const history = useHistory();
  const pathname = usePathname();
  const globalSearchPath = `/org/${organization?.slug}/support`;
  const isOnGlobalSearch = useMemo(() => {
    return pathname.includes(globalSearchPath);
  }, [pathname]);

  const _goToGlobalSearchScreen = () => history.push(globalSearchPath);

  return (
    <button
      style={{
        ...styles.container,
        ...(isOnGlobalSearch && {
          backgroundColor: Colors.lightGray,
          cursor: "default",
        }),
      }}
      onClick={_goToGlobalSearchScreen}
      disabled={isOnGlobalSearch}
      className="tab"
    >
      <img src={SearchIcon} style={styles.icon} />
      <label
        style={{
          ...styles.tabTitle,
          ...(!isOnGlobalSearch && { cursor: "pointer" }),
        }}
      >
        Global Search
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
