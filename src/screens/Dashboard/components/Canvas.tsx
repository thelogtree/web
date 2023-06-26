import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  getCanAddWidget,
  getNewWidgets,
  getWidgets,
} from "src/redux/organization/selector";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";

import { useDesignWidgetShape } from "../lib";
import { ErrorMessage } from "./ErrorMessage";
import { NewWidget } from "./NewWidget";
import { NewWidgetPlaceholderBox } from "./NewWidgetPlaceholderBox";
import { Widget } from "./Widget";

type Props = {
  isFetching: boolean;
};

export const Canvas = ({ isFetching }: Props) => {
  const [loadedForFirstTime, setLoadedForFirstTime] = useState<boolean>(false);
  const widgets = useSelector(getWidgets);
  const isInAddWidgetMode = useSelector(getCanAddWidget);
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging,
    canvasRef,
    isErrorVisible,
    placeholderWidgetAdjustedPositionAndSize,
  } = useDesignWidgetShape();
  const newWidgets = useSelector(getNewWidgets);
  const canScroll = Boolean(widgets.length || newWidgets.length);

  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "default";
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isFetching) {
      setLoadedForFirstTime(true);
    }
  }, [isFetching]);

  if (!loadedForFirstTime) {
    return (
      <div style={styles.container}>
        <LoadingSpinnerFullScreen />
      </div>
    );
  }

  return (
    <>
      <ErrorMessage isErrorVisible={isErrorVisible} />
      <div
        style={{
          ...styles.container,
          ...(isInAddWidgetMode && { cursor: "crosshair" }),
          ...(canScroll && styles.scrollable),
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        className={isDragging ? "disable-text-selection" : ""}
        id="canvas-container"
      >
        {widgets.map((widget) => (
          <Widget widgetObj={widget} key={widget.widget._id.toString()} />
        ))}
        {newWidgets.map((_, i) => (
          <NewWidget indexInArr={i} key={i} />
        ))}
        <NewWidgetPlaceholderBox
          isDragging={isDragging}
          adjustedPositionAndSize={placeholderWidgetAdjustedPositionAndSize}
        />
      </div>
    </>
  );
};

const styles: StylesType = {
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "auto",
  },
  scrollable: {
    // fix this later
    // top: -200,
    // bottom: -200,
    // left: -200,
    // right: -200,
  },
};
