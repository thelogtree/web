import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { getAuthStatus } from "./redux/auth/selector";
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
import { InsightsScreen } from "./screens/Insights";
import { getSidebarWidth } from "./redux/organization/selector";
import { TermsOfServiceRenderer } from "./screens/Policies/TermsOfServiceRenderer";
import { PrivacyPolicyRenderer } from "./screens/Policies/PrivacyPolicyRenderer";
import { LandingPage } from "./screens/LandingPage";
import { IntegrationsScreen } from "./screens/Integrations";
import { SupportLogsScreen } from "./screens/SupportLogs";
import { OAuthCallbackScreen } from "./screens/OAuthCallback";

const ROUTES_WITH_SIDEBAR = ["/org"];
export const LOGS_ROUTE_PREFIX = "/logs";
export const ORG_ROUTE_PREFIX = "/org";

export const SUPPORT_TOOL_SUFFIX = "/journey";

export const RouteManager = () => {
  const authStatus = useSelector(getAuthStatus);
  const activePathname = usePathname();
  const path = getFirstPathWithSlash(activePathname);
  const sidebarWidth = useSelector(getSidebarWidth);
  const routeNeedsSidebar = useMemo(() => {
    return (
      ROUTES_WITH_SIDEBAR.includes(path) &&
      !activePathname.includes(SUPPORT_TOOL_SUFFIX)
    );
  }, [path, activePathname]);

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
          <Route path="/oauth-callback" component={OAuthCallbackScreen} />
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
            path={`${ORG_ROUTE_PREFIX}/:slug${SUPPORT_TOOL_SUFFIX}`}
            component={SupportLogsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/insights`}
            component={InsightsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/integrations`}
            component={IntegrationsScreen}
          />
          <Route path="/invite/:slug/:id" component={InviteScreen} />
          <Route
            path="/policies/privacy-policy"
            component={PrivacyPolicyRenderer}
          />
          <Route
            path="/policies/terms-of-service"
            component={TermsOfServiceRenderer}
          />
          <Route exact path="/" component={LandingPage} />
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
