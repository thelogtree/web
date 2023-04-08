import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import SyncIcon from "src/assets/sync.png";

type Props = {
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export const RefreshButton = ({ isLoading, refresh }: Props) =>
  isLoading ? null : (
    <button
      style={styles.container}
      onClick={refresh}
      disabled={isLoading}
      className="refreshBtn"
    >
      <img src={SyncIcon} style={styles.icon} />
      <label style={styles.text}>Refresh</label>
    </button>
  );

const styles: StylesType = {
  container: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    borderRadius: 20,
    borderColor: Colors.darkGray,
    borderWidth: 1,
    borderStyle: "solid",
    marginLeft: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    boxShadow: "0px 2px 1px rgba(0,0,0,0.05)",
  },
  icon: {
    width: 13,
    height: 13,
    cursor: "pointer",
  },
  text: {
    color: Colors.darkGray,
    fontSize: 12,
    paddingLeft: 6,
    cursor: "pointer",
  },
};
