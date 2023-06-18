import React from "react";
import { useCurrentDashboard } from "../lib";
import { useSelector } from "react-redux";
import {
  getDashboards,
  getOrganization,
} from "src/redux/organization/selector";
import { Select } from "antd";
import { useHistory } from "react-router-dom";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";

export const DashboardPicker = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const currentDashboard = useCurrentDashboard();

  const _handleChange = (dashboardId: string) => {
    history.push(
      `${ORG_ROUTE_PREFIX}/${organization?.slug}${DASHBOARD_ROUTE_PREFIX}/${dashboardId}`
    );
  };

  if (!currentDashboard) {
    return null;
  }

  return (
    <Select
      defaultValue={currentDashboard._id.toString()}
      value={currentDashboard._id.toString()}
      style={{ width: 120 }}
      onChange={_handleChange}
      options={dashboards.map((dashboard) => ({
        label: dashboard.title,
        value: dashboard._id.toString(),
      }))}
    />
  );
};
