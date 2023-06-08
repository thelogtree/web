import React from "react";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { StylesType } from "src/utils/styles";

type Props = {
  overridePaddingTop?: number;
};

export const LoadingLogs = ({ overridePaddingTop }: Props) => (
  <div
    style={{
      ...styles.loadingContainer,
      ...(overridePaddingTop && { paddingTop: overridePaddingTop }),
    }}
  >
    <LoadingSpinner size={40} />
  </div>
);

const styles: StylesType = {
  loadingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingTop: 200,
  },
};
