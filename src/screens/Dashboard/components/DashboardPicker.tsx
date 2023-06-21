import { Button, Divider, Input, InputRef, Select, Space } from "antd";
import React, { useRef, useState } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import { Api } from "src/api";
import { useFetchDashboards } from "src/redux/actionIndex";
import { showGenericErrorAlert } from "src/utils/helpers";
import { Colors } from "src/utils/colors";
import Swal from "sweetalert2";

export const DashboardPicker = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const currentDashboard = useCurrentDashboard();
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch: fetchDashboards } = useFetchDashboards();
  const inputRef = useRef<InputRef>(null);

  const _handleChange = (dashboardId: string) => {
    localStorage.setItem(LOCAL_STORAGE_DASHBOARD_ID_KEY, dashboardId);
    window.open(
      `${ORG_ROUTE_PREFIX}/${organization?.slug}${DASHBOARD_ROUTE_PREFIX}/${dashboardId}`,
      "_self"
    );
  };

  const _onTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const _addDashboard = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await Api.organization.createDashboard(
        organization!._id.toString(),
        title
      );
      const { dashboard } = res.data;
      await fetchDashboards();
      setTitle("");
      _handleChange(dashboard._id);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _deleteDashboard = async () => {
    setIsLoading(true);
    try {
      const dashboardToDelete = currentDashboard;
      await Api.organization.deleteDashboard(
        organization!._id.toString(),
        dashboardToDelete!._id.toString()
      );
      const otherDashboardToNavigateTo = dashboards.find(
        (d) => d._id.toString() !== dashboardToDelete?._id.toString()
      );
      await fetchDashboards();
      _handleChange(otherDashboardToNavigateTo!._id.toString());
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  if (!currentDashboard) {
    return null;
  }

  return (
    <Select
      placeholder="custom dropdown render"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Input
              placeholder="New dashboard title"
              ref={inputRef}
              value={title}
              onChange={_onTitleInputChange}
            />
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={_addDashboard}
              disabled={isLoading}
            >
              Create dashboard
            </Button>
          </Space>
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Button
              type="text"
              onClick={_deleteDashboard}
              disabled={isLoading}
              style={styles.deleteDashboard}
            >
              Delete "{currentDashboard.title}" dashboard
            </Button>
          </Space>
        </>
      )}
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
      showArrow={false}
      dropdownStyle={{ minWidth: 400 }}
    />
  );
};

const styles: StylesType = {
  mainSelectLabel: {
    color: "white",
    opacity: 1,
    cursor: "pointer",
  },
  deleteDashboard: {
    color: Colors.red,
  },
};
