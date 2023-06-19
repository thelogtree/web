import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCanAddWidget, getWidgets } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";
import { Widget } from "./Widget";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { useDesignWidgetShape } from "../lib";
import { ErrorMessage } from "./ErrorMessage";
import { NewWidget } from "./NewWidget";
import { NewWidgetPlaceholderBox } from "./NewWidgetPlaceholderBox";

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
    newWidgets,
    setNewWidgets,
    placeholderWidgetAdjustedPositionAndSize,
  } = useDesignWidgetShape();
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
    >
      {widgets.map((widget) => (
        <Widget widgetObj={widget} key={widget.widget._id.toString()} />
      ))}
      {newWidgets.map((_, i) => (
        <NewWidget
          newWidgets={newWidgets}
          indexInArr={i}
          setNewWidgets={setNewWidgets}
          key={i}
        />
      ))}
      <NewWidgetPlaceholderBox
        isDragging={isDragging}
        adjustedPositionAndSize={placeholderWidgetAdjustedPositionAndSize}
      />
      <ErrorMessage isErrorVisible={isErrorVisible} />
    </div>
  );
};

const styles: StylesType = {
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#EBEBEB",
  },
  scrollable: {
    // fix this later
    // top: -200,
    // bottom: -200,
    // left: -200,
    // right: -200,
  },
};
