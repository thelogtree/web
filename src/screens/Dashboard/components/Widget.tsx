import { widgetType } from "logtree-types";
import React from "react";
import { FrontendWidget } from "src/redux/organization/reducer";
import { LogsList } from "src/screens/Logs/components/LogsList";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { getAdjustedPositionAndSizeOfWidget } from "../lib";

type Props = {
  widgetObj: FrontendWidget;
};

export const Widget = ({ widgetObj }: Props) => {
  const { widget, data } = widgetObj;
  const adjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    widget.position,
    widget.size
  );

  const _renderData = () => {
    if (!data) {
      return (
        <div style={styles.loadingContainer}>
          <LoadingSpinner size={25} />
        </div>
      );
    }

    switch (widget.type) {
      case widgetType.Logs:
        const endOfFeedText =
          data.length >= 50
            ? "There are more events not shown."
            : "There are no more events to show.";
        return (
          <LogsList
            logs={data}
            isSearchQueued={false}
            isLoading={false}
            endOfFeedText={endOfFeedText}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...adjustedPositionAndSize,
      }}
    >
      <label style={styles.title}>{widget.title}</label>
      <label style={styles.description}>Live</label>
      {_renderData()}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#A5A5A5",
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    position: "absolute",
    zIndex: 10,
    overflowX: "hidden",
    overflowY: "auto",
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  description: {
    color: Colors.gray,
    paddingTop: 2,
  },
  loadingContainer: {
    width: "100%",
  },
};
