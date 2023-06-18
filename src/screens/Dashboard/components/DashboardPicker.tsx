import React from "react";
import { LOCAL_STORAGE_DASHBOARD_ID_KEY, useCurrentDashboard } from "../lib";
import { useSelector } from "react-redux";
import {
  getDashboards,
  getOrganization,
} from "src/redux/organization/selector";
import { Select } from "antd";
import { useHistory } from "react-router-dom";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import "../index.css";

export const DashboardPicker = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const currentDashboard = useCurrentDashboard();

  const _handleChange = (dashboardId: string) => {
    localStorage.setItem(LOCAL_STORAGE_DASHBOARD_ID_KEY, dashboardId);
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
      onChange={_handleChange}
      options={dashboards.map((dashboard) => ({
        label: dashboard.title,
        value: dashboard._id.toString(),
      }))}
      className="ant-select-selector"
      showArrow={false}
    />
  );
};
