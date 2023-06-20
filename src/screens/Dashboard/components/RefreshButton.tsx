import React from "react";
import { useFetchWidgetsWithData } from "src/redux/actionIndex";
import RefreshIcon from "src/assets/refresh.png";
import { SharedStyles, StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";

export const RefreshButton = () => {
  const { fetch, isFetching } = useFetchWidgetsWithData();

  return (
    <button
      style={{
        ...styles.container,
        ...(isFetching && SharedStyles.loadingButton),
      }}
      onClick={fetch}
      disabled={isFetching}
    >
      <img src={RefreshIcon} style={styles.icon} />
      <label style={styles.refreshLbl}>
        {isFetching ? "Pulling..." : "Pull data"}
      </label>
    </button>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    marginLeft: 15,
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
  },
  icon: {
    width: 16,
    height: 16,
    cursor: "pointer",
  },
  refreshLbl: {
    cursor: "pointer",
    color: Colors.white,
    paddingLeft: 6,
    fontSize: 13,
  },
};
