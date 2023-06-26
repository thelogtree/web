import { widgetType } from "logtree-types";
import React, { useCallback, useMemo, useState } from "react";
import { FrontendWidget } from "src/redux/organization/reducer";
import { LogsList } from "src/screens/Dashboard/components/widgetTypes/LogsList";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { getAdjustedPositionAndSizeOfWidget } from "../lib";
import { DeleteWidgetButton } from "./DeleteWidgetButton";
import "../Widget.css";
import { Histogram } from "./widgetTypes/Histogram";
import { PieChart } from "./widgetTypes/PieChart";
import { StackedHistogram } from "./widgetTypes/StackedHistogram";
import { EmbeddedLink } from "./widgetTypes/EmbeddedLink";
import { useResizeOrDragWidget } from "../useResizeOrDragWidget";
import { DataHiddenWhileDragging } from "./DataHiddenWhileDragging";

type Props = {
  widgetObj: FrontendWidget;
};

export const Widget = ({ widgetObj }: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const { widget, data } = widgetObj;
  const { onMouseDown, isDragging, isResizing, CornerBlocks } =
    useResizeOrDragWidget(widget);
  const adjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    widget.position,
    widget.size
  );
  const titleFontSize = useMemo(() => {
    const { widget } = widgetObj;
    const title = widget.title;
    const width = widget.size.width;
    if (title.length > 20 && width < 300) {
      return 15;
    } else if (width < 300) {
      return 16;
    } else if (title.length > 20 && width < 500) {
      return 16;
    }
    return 18;
  }, [widgetObj.widget.size.width, widgetObj.widget.title]);

  const _renderData = () => {
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
    >
      {isResizing || isDragging ? (
        <DataHiddenWhileDragging />
      ) : (
        <>
          <label style={{ ...styles.title, fontSize: titleFontSize }}>
            {widget.title}
          </label>
          <DeleteWidgetButton widget={widget} isVisible={isHovering} />
          {_renderData()}
        </>
      )}
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
    fontWeight: 500,
    width: "84%",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    minHeight: 20,
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
