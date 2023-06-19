import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getCanAddWidget, getWidgets } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";
import { Widget } from "./Widget";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { useDesignWidgetShape } from "../lib";

type Props = {
  isFetching: boolean;
};

export const Canvas = ({ isFetching }: Props) => {
  const widgets = useSelector(getWidgets);
  const isInAddWidgetMode = useSelector(getCanAddWidget);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] =
    useState<boolean>(false);
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    NewWidgetBox,
    canvasRef,
  } = useDesignWidgetShape(isAddWidgetModalOpen);

  return (
    <div
      style={{
        ...styles.container,
        ...(isInAddWidgetMode && { cursor: "crosshair" }),
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={canvasRef}
    >
      {isFetching ? (
        <LoadingSpinnerFullScreen />
      ) : (
        widgets.map((widget) => <Widget widgetObj={widget} />)
      )}
      <NewWidgetBox />
    </div>
  );
};

const styles: StylesType = {
  container: {
    position: "absolute",
    top: -200,
    right: -200,
    bottom: -200,
    left: -200,
    backgroundColor: "#EBEBEB",
  },
};
