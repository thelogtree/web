import React from 'react';
import { useSelector } from 'react-redux';
import RefreshIcon from 'src/assets/refresh.png';
import { useFetchWidgetsWithData } from 'src/redux/actionIndex';
import { getWidgets } from 'src/redux/organization/selector';
import { Colors } from 'src/utils/colors';
import { SharedStyles, StylesType } from 'src/utils/styles';

export const RefreshButton = () => {
  const widgets = useSelector(getWidgets);
  const { fetch, isFetching } = useFetchWidgetsWithData();

  return widgets.length ? (
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
        {isFetching ? "Refresh..." : "Refresh data"}
      </label>
    </button>
  ) : null;
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
