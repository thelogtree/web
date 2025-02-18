import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

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
import { IntegrationsScreen } from "./screens/Integrations";
import { SupportLogsScreen } from "./screens/SupportLogs";
import { OAuthCallbackScreen } from "./screens/OAuthCallback";
import { IntercomLearnMoreScreen } from "./screens/IntercomLearnMore";
import { IntegrationLogsScreen } from "./screens/IntegrationLogs";
import { GlobalSearchScreen } from "./screens/GlobalSearch";
import { CreateOrganizationScreen } from "./screens/CreateOrganization";
import { FunnelsScreen } from "./screens/Funnels";
import { LandingPageProjects } from "./screens/LandingPageProjects";
import { DashboardScreen } from "./screens/Dashboard";
import { Constants } from "./utils/constants";

const ROUTES_WITH_SIDEBAR = ["/org"];
export const LOGS_ROUTE_PREFIX = "/logs";
export const ORG_ROUTE_PREFIX = "/org";
export const DASHBOARD_ROUTE_PREFIX = "/dashboard";
export const CONNECTION_ROUTE_PREFIX = "/connection";
export const GLOBAL_SEARCH_SUFFIX = "/search";
export const SUPPORT_TOOL_SUFFIX = "/journey";

export const RouteManager = () => {
  const authStatus = useSelector(getAuthStatus);
  const activePathname = usePathname();
  const path = getFirstPathWithSlash(activePathname);
  const sidebarWidth = useSelector(getSidebarWidth);
  const routeNeedsSidebar = useMemo(() => {
    return (
      ROUTES_WITH_SIDEBAR.includes(path) &&
      !activePathname.includes(DASHBOARD_ROUTE_PREFIX) /* &&
      !activePathname.includes(SUPPORT_TOOL_SUFFIX)*/
    );
  }, [path, activePathname]);

  return authStatus === "UNDETERMINED" ? null : (
    <Switch>
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          <Route path="/org/sign-out" component={SignOutScreen} />
          <Route path="/sign-in" component={SignInScreen} />
          <Route path="/sign-up" component={CreateOrganizationScreen} />
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
            path={`${ORG_ROUTE_PREFIX}/:slug${CONNECTION_ROUTE_PREFIX}`}
            component={IntegrationLogsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/favorites`}
            component={LogsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/funnels`}
            component={FunnelsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug${SUPPORT_TOOL_SUFFIX}`}
            component={SupportLogsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/search`}
            component={GlobalSearchScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/insights`}
            component={InsightsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug/integrations`}
            component={IntegrationsScreen}
          />
          <Route
            path={`${ORG_ROUTE_PREFIX}/:slug${DASHBOARD_ROUTE_PREFIX}/:dashboardId`}
            component={DashboardScreen}
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
          <Route path="/learn/intercom" component={IntercomLearnMoreScreen} />
          <Route
            exact
            path="/"
            component={() => {
              window.location.href = Constants.landingPageUrl;
              return null;
            }}
          />
          <Route exact path="/projects" component={LandingPageProjects} />
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
