import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getCanAddWidget, getWidgets } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";
import { Widget } from "./Widget";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";

type Props = {
  isFetching: boolean;
};

export const Canvas = ({ isFetching }: Props) => {
  const widgets = useSelector(getWidgets);
  const isInAddWidgetMode = useSelector(getCanAddWidget);

  return (
    <div
      style={{
        ...styles.container,
        ...(isInAddWidgetMode && { cursor: "crosshair" }),
      }}
    >
      {isFetching ? (
        <LoadingSpinnerFullScreen />
      ) : (
        widgets.map((widget) => <Widget widgetObj={widget} />)
      )}
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
