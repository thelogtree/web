import React from "react";
import { StylesType } from "src/utils/styles";

type Props = {
  text: string;
};

export const BigTextHeader = ({ text }) => (
  <label style={styles.text}>{text}</label>
);

const styles: StylesType = {
  text: {
    fontSize: 28,
    fontWeight: 600,
  },
};
