import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { getAuthStatus } from "./redux/auth/selector";
import { LoadingSpinner } from "./sharedComponents/LoadingSpinner";
import { Colors } from "./utils/colors";
import { constants } from "./utils/constants";
import { StylesType } from "./utils/styles";
import { getFirstPathWithSlash, usePathname } from "./utils/helpers";
import { Sidebar } from "./sharedComponents/Sidebar";
import { SignInScreen } from "./screens/SignIn";
import { DashboardScreen } from "./screens/Dashboard";
import { InviteScreen } from "./screens/Invite";

const ROUTES_WITH_SIDEBAR = ["/org"];

export const RouteManager = () => {
  const authStatus = useSelector(getAuthStatus);
  const activePathname = usePathname();
  const path = getFirstPathWithSlash(activePathname);
  const routeNeedsSidebar = useMemo(() => {
    return ROUTES_WITH_SIDEBAR.includes(path);
  }, [path]);

  return authStatus === "UNDETERMINED" ? null : (
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
          <Route path="/sign-in" component={SignInScreen} />
          <Route path="/org/:slug/dashboard" component={DashboardScreen} />
          <Route path="/invite/:slug/:id" component={InviteScreen} />
        </div>
      </div>
    </Switch>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.white,
  },
};
