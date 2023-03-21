import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { getAuthStatus } from "./redux/auth/selector";
import { LoadingSpinner } from "./sharedComponents/LoadingSpinner";
import { Colors } from "./utils/colors";
import { constants } from "./utils/constants";
import { StylesType } from "./utils/styles";
import { getFirstPathWithSlash, usePathname } from "./utils/helpers";
import { SignIn } from "./screens/SignIn";
import { Dashboard } from "./screens/Dashboard";
import { Sidebar } from "./sharedComponents/Sidebar";
import { Invite } from "./screens/Invite";

const ROUTES_WITH_SIDEBAR = ["/org"];

export const RouteManager = () => {
  const authStatus = useSelector(getAuthStatus);
  const activePathname = usePathname();
  const path = getFirstPathWithSlash(activePathname);
  const routeNeedsSidebar = useMemo(() => {
    return ROUTES_WITH_SIDEBAR.includes(path);
  }, [path]);

  return authStatus === "UNDETERMINED" ? (
    <div style={styles.loadingContainer}>
      <LoadingSpinner />
    </div>
  ) : (
    <Switch>
      <div style={styles.container}>
        {routeNeedsSidebar ? <Sidebar /> : null}
        <div
          style={
            routeNeedsSidebar
              ? { paddingLeft: constants.sidebarWidth }
              : undefined
          }
        >
          <Route path="/sign-in" component={SignIn} />
          <Route path="/org/:slug/dashboard" component={Dashboard} />
          <Route path="/invite/:slug/:id" component={Invite} />
        </div>
      </div>
    </Switch>
  );
};

const styles: StylesType = {
  loadingContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.darkerWhite,
  },
};
