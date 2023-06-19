import { widgetType } from "logtree-types";
import React, { useState } from "react";
import { FrontendWidget } from "src/redux/organization/reducer";
import { LogsList } from "src/screens/Dashboard/components/LogsList";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { getAdjustedPositionAndSizeOfWidget } from "../lib";
import { DeleteWidgetButton } from "./DeleteWidgetButton";

type Props = {
  widgetObj: FrontendWidget;
};

export const Widget = ({ widgetObj }: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
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
        return <LogsList logs={data} />;
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
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <label style={styles.title}>{widget.title}</label>
      <DeleteWidgetButton widget={widget} isVisible={isHovering} />
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
    paddingTop: 6,
    paddingBottom: 12,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
