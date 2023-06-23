import { widgetType } from "logtree-types";
import React, { useCallback, useState } from "react";
import { FrontendWidget } from "src/redux/organization/reducer";
import { LogsList } from "src/screens/Dashboard/components/LogsList";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import {
  getAdjustedPositionAndSizeOfWidget,
  useDragWidget,
  useResizeWidget,
} from "../lib";
import { DeleteWidgetButton } from "./DeleteWidgetButton";
import "../Widget.css";
import { Histogram } from "./Histogram";
import { PieChart } from "./PieChart";
import { StackedHistogram } from "./StackedHistogram";
import { EmbeddedLink } from "./EmbeddedLink";

type Props = {
  widgetObj: FrontendWidget;
};

export const Widget = ({ widgetObj }: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const { onMouseDown, onMouseMove, onMouseUp, isDragging } = useDragWidget(
    widgetObj.widget
  );
  const { CornerBlocks, isDragging: isResizingWidget } = useResizeWidget(
    widgetObj.widget
  );
  const { widget, data } = widgetObj;
  const adjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    widget.position,
    widget.size
  );

  const _renderData = () => {
    if (isResizingWidget) {
      return (
        <label style={styles.dataHidden}>
          Data is hidden while resizing widget.
        </label>
      );
    }

    if (!data) {
      return (
        <div style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
        </div>
      );
    }

    switch (widget.type) {
      case widgetType.Logs:
        return <LogsList logs={data} />;
      case widgetType.Histograms:
        const histogram = data[0];
        return (
          <Histogram
            graphData={histogram.graphData}
            fullPath={histogram.fullPath}
            numLogsTotal={histogram.numLogsTotal}
            suffix={histogram.suffix}
            widget={widget}
          />
        );
      case widgetType.PieChartByContent:
        return (
          <PieChart
            graphData={data.graphData}
            fullPath={data.fullPath}
            numLogsTotal={data.numLogsTotal}
            suffix={data.suffix}
            widget={widget}
          />
        );
      case widgetType.HealthMonitor:
        return (
          <StackedHistogram
            fullPathSuccess={data[0].fullPath}
            fullPathError={data[1].fullPath}
            numLogsSuccess={data[0].numLogsTotal}
            numLogsError={data[1].numLogsTotal}
            successSuffix={data[0].suffix}
            errorSuffix={data[1].suffix}
            widget={widget}
            graphDataSuccess={data[0].graphData}
            graphDataError={data[1].graphData}
          />
        );
      case widgetType.HistogramComparison:
        return (
          <StackedHistogram
            fullPathSuccess={data[0].fullPath}
            fullPathError={data[1].fullPath}
            numLogsSuccess={data[0].numLogsTotal}
            numLogsError={data[1].numLogsTotal}
            successSuffix={data[0].suffix}
            errorSuffix={data[1].suffix}
            widget={widget}
            graphDataSuccess={data[0].graphData}
            graphDataError={data[1].graphData}
          />
        );
      case widgetType.EmbeddedLink:
        return <EmbeddedLink html={widgetObj.data.html} widget={widget} />;
      default:
        return null;
    }
  };

  const _handleOnMouseLeave = useCallback(() => {
    setIsHovering(false);
    onMouseUp();
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        ...adjustedPositionAndSize,
        ...(isDragging && { cursor: "grabbing" }),
      }}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={_handleOnMouseLeave}
      className="widgetContainer"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <label style={styles.title}>{widget.title}</label>
      <DeleteWidgetButton widget={widget} isVisible={isHovering} />
      {_renderData()}
      {CornerBlocks}
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
    cursor: "grab",
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
  dataHidden: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 13,
  },
};
