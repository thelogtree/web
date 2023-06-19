import { Select } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getDashboards,
  getOrganization,
} from "src/redux/organization/selector";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";
import { StylesType } from "src/utils/styles";

import { LOCAL_STORAGE_DASHBOARD_ID_KEY, useCurrentDashboard } from "../lib";
import "../DashboardPicker.css";

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
      value={
        {
          value: currentDashboard._id.toString(),
          label: (
            <label style={styles.mainSelectLabel}>
              {currentDashboard.title}
            </label>
          ),
        } as any
      }
      onChange={_handleChange}
      options={dashboards.map((dashboard) => ({
        label: dashboard.title,
        value: dashboard._id.toString(),
      }))}
      labelInValue={true}
      showArrow={false}
      dropdownStyle={{ minWidth: 200 }}
    />
  );
};

const styles: StylesType = {
  mainSelectLabel: {
    color: "white",
    opacity: 1,
    cursor: "pointer",
  },
};
