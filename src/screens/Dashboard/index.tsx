import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useFetchFolders,
  useFetchWidgetsWithData,
} from "src/redux/actionIndex";
import { getOrganization, getWidgets } from "src/redux/organization/selector";
import { useCurrentDashboard } from "./lib";
import { StylesType } from "src/utils/styles";
import { HeaderBar } from "./components/HeaderBar";
import { Canvas } from "./components/Canvas";
import { PassiveAlert } from "./components/PassiveAlert";
import { Colors } from "src/utils/colors";

export const DashboardScreen = () => {
  const organization = useSelector(getOrganization);
  const currentDashboard = useCurrentDashboard();
  const { fetch: fetchFolders } = useFetchFolders();
  const { fetch: fetchWidgets, isFetching } = useFetchWidgetsWithData(true);

  useEffect(() => {
    if (organization && currentDashboard) {
      fetchWidgets();
      fetchFolders();
    }
  }, [organization?._id, currentDashboard?._id]);

  return (
    <div style={styles.container} id="canvas-fullscreen">
      <HeaderBar />
      <Canvas isFetching={isFetching} />
      <PassiveAlert isFetchingWidgets={isFetching} />
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    backgroundColor: Colors.canvasBackground,
  },
};
