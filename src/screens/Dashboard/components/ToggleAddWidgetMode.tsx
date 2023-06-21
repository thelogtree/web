import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCanAddWidget } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import DragDropIcon from "src/assets/whiteSquare1.png";
import { setCanAddWidget } from "src/redux/actionIndex";

export const ToggleAddWidgetMode = () => {
  const dispatch = useDispatch();
  const canAddWidget = useSelector(getCanAddWidget);

  return (
    <button
      style={{
        ...styles.container,
        ...(canAddWidget && { backgroundColor: Colors.blue500 }),
      }}
      onClick={() => dispatch(setCanAddWidget(!canAddWidget))}
    >
      <img src={DragDropIcon} style={styles.icon} />
    </button>
  );
};

const styles: StylesType = {
  container: {
    cursor: "pointer",
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    height: "100%",
    width: 70,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    cursor: "pointer",
  },
};
