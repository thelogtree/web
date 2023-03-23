import React from "react";
import { StylesType } from "src/utils/styles";

type Props = {
  children?: any;
  outerStyle?: Object;
  innerStyle?: Object;
};

export const DynamicContainer = ({
  children,
  outerStyle,
  innerStyle,
}: Props) => (
  <div style={{ ...styles.outerContainer, ...outerStyle }}>
    <div style={{ ...styles.innerContainer, ...innerStyle }}>{children}</div>
  </div>
);

const styles: StylesType = {
  outerContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    height: "100%",
    maxWidth: 600,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
};
