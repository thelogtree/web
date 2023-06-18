import { DashboardDocument } from "logtree-types";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";
import { useFetchDashboards } from "src/redux/actionIndex";
import {
  getDashboards,
  getOrganization,
} from "src/redux/organization/selector";

export const useCurrentDashboard = (
  doNotRefetchDashboards?: boolean
): DashboardDocument | null => {
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const { fetch } = useFetchDashboards();
  const params = useParams();
  const { dashboardId } = params as any;

  useEffect(() => {
    if (
      !doNotRefetchDashboards &&
      organization &&
      (!dashboards.length ||
        dashboards[0].organizationId.toString() !== organization._id.toString())
    ) {
      fetch();
    }
  }, [organization?._id, dashboards.length]);

  const currentDashboard = useMemo(() => {
    return dashboards.find((d) => d._id.toString() === dashboardId) ?? null;
  }, [organization?._id, dashboards.length]);

  return currentDashboard;
};

export const LOCAL_STORAGE_DASHBOARD_ID_KEY = "viewing_dashboard_id";
export const useNavigateToDashboardIfLost = () => {
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const { fetch } = useFetchDashboards();
  const history = useHistory();
  const currentDashboard = useCurrentDashboard(true);

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  const navigateIfLost = () => {
    if (!currentDashboard && dashboards.length) {
      let dashboardId = localStorage.getItem(LOCAL_STORAGE_DASHBOARD_ID_KEY);
      if (!dashboards.find((d) => d._id.toString() === dashboardId)) {
        dashboardId = dashboards[0]._id.toString();
        localStorage.setItem(LOCAL_STORAGE_DASHBOARD_ID_KEY, dashboardId);
      }
      history.push(
        `${ORG_ROUTE_PREFIX}/${organization?.slug}${DASHBOARD_ROUTE_PREFIX}/${dashboardId}`
      );
    }
  };

  return { navigateIfLost };
};
