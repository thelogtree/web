import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { getAuthStatus } from "./redux/auth/selector";
import { LoadingSpinner } from "./sharedComponents/LoadingSpinner";
import { Colors } from "./utils/colors";
import { StylesType } from "./utils/styles";
import { getFirstPathWithSlash, usePathname } from "./utils/helpers";
import { Sidebar } from "./sharedComponents/Sidebar";
import { SignInScreen } from "./screens/SignIn";
import { ApiDashboardScreen } from "./screens/ApiDashboard";
import { InviteScreen } from "./screens/Invite";
import { LogsScreen } from "./screens/Logs";
import { TeamScreen } from "./screens/Team";
import { SignOutScreen } from "./screens/SignOut";
import { GlobalSearchScreen } from "./screens/GlobalSearch";
import { InsightsScreen } from "./screens/Insights";
import { getSidebarWidth } from "./redux/organization/selector";

const ROUTES_WITH_SIDEBAR = ["/org"];
export const LOGS_ROUTE_PREFIX = "/logs";
export const ORG_ROUTE_PREFIX = "/org";

export const RouteManager = () => {
  const authStatus = useSelector(getAuthStatus);
  const activePathname = usePathname();
  const path = getFirstPathWithSlash(activePathname);
  const sidebarWidth = useSelector(getSidebarWidth);
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
              ? {
                  ...styles.innerContainer,
                  left: sidebarWidth,
                }
              : styles.innerContainer
          }
        >
          <Route path="/org/sign-out" component={SignOutScreen} />
          <Route path="/sign-in" component={SignInScreen} />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/api-dashboard`}
            component={ApiDashboardScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/team`}
            component={TeamScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug${LOGS_ROUTE_PREFIX}`}
            component={LogsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/favorites`}
            component={LogsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/search`}
            component={GlobalSearchScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/insights`}
            component={InsightsScreen}
          />
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
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
  },
};
