import { CSSProperties } from "react";
import Modal, { Styles } from "react-modal";
import { Colors } from "./colors";

export type StylesType = { [key in string]: CSSProperties };

export const SharedStyles: StylesType = {
  textOverflowEllipsis: {
    textOverflow: "ellipsis",
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  modal: {
    content: {
      top: "20%",
      left: "20%",
      bottom: "20%",
      right: "20%",
      borderWidth: 0,
      boxShadow: "0px 0px 40px 0px rgba(0,0,0,0.1)",
      borderRadius: 10,
      overflowY: "auto",
      zIndex: 100,
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.1)",
      zIndex: 90,
    },
  } as any,
  modalHeader: {
    height: 80,
    backgroundColor: Colors.white,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    boxShadow: "0px 3px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  modalInnerContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    overflowY: "auto",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 20,
  },
  modalSubheaderText: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.6,
    display: "inline-block",
    marginBottom: 10,
  } as CSSProperties,
  shadow1: {
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  loadingButton: {
    cursor: "default",
    opacity: 0.3,
  },
};
