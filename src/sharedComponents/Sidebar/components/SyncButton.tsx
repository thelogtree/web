import { Tooltip } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SyncIcon from "src/assets/sync.png";
import { getFolders } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const SyncButton = () => {
  const folders = useSelector(getFolders);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshedDate, setLastRefreshedDate] = useState<Date | null>(null);

  const _refresh = () => {
    setIsLoading(true);
    window.location.reload();
    setIsLoading(false);
  };

  useEffect(() => {
    setLastRefreshedDate(new Date());
  }, [folders.length]);

  return lastRefreshedDate ? (
    <Tooltip
      title={`Last pulled channels ${moment(lastRefreshedDate).fromNow()}`}
    >
      <button style={styles.container} onClick={_refresh} disabled={isLoading}>
        <img src={SyncIcon} style={styles.icon} />
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
};
