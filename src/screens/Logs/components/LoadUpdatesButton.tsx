import React, { useState } from "react";
import { useChildrenHasUnreadLogs, useFindFrontendFolderFromUrl } from "../lib";
import { Tooltip } from "antd";
import SyncIcon from "src/assets/sync.png";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";

type Props = {
  refreshLogs: (shouldResetQueryString?: boolean) => Promise<void>;
};

export const LoadUpdatesButton = ({ refreshLogs }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const frontendFolder = useFindFrontendFolderFromUrl();
  const channelHasUnreadLogs = useChildrenHasUnreadLogs(frontendFolder);

  const _refresh = async () => {
    setIsLoading(true);
    await refreshLogs(true);
    setIsLoading(false);
  };

  return channelHasUnreadLogs ? (
    <button style={styles.container} onClick={_refresh} disabled={isLoading}>
      <img src={SyncIcon} style={styles.icon} />
      <label style={styles.text}>See new logs</label>
    </button>
  ) : null;
};

const styles: StylesType = {
  container: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.white,
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
