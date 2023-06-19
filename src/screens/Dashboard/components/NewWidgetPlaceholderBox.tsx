import React, { CSSProperties } from "react";
import { useSelector } from "react-redux";
import { getCanAddWidget } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";

type Props = {
  isDragging: boolean;
  adjustedPositionAndSize: CSSProperties;
};

export const NewWidgetPlaceholderBox = ({
  isDragging,
  adjustedPositionAndSize,
}: Props) => {
  const canAddWidget = useSelector(getCanAddWidget);
  if (!isDragging || !canAddWidget) {
    return null;
  }

  return (
    <div
      style={{
        ...styles.newWidgetBox,
        ...adjustedPositionAndSize,
      }}
    />
  );
};

const styles: StylesType = {
  newWidgetBox: {
    border: "1px solid gray",
    position: "absolute",
    borderRadius: 20,
    zIndex: 15,
  },
};
