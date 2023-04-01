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
    <Tooltip title="Click to see the new logs">
      <button style={styles.container} onClick={_refresh} disabled={isLoading}>
        <img
          src={SyncIcon}
          style={{ ...styles.icon, ...(isLoading && styles.spin) }}
        />
      </button>
    </Tooltip>
  ) : null;
};

const styles: StylesType = {
  container: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
  },
  icon: {
    width: 13,
    height: 13,
    cursor: "pointer",
  },
  spin: {
    animation: "spin 4s linear infinite",
  },
};
