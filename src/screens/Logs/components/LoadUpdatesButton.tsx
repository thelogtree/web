import "../index.css";

import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import SyncIcon from "src/assets/sync.png";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import {
  useChildrenHasUnreadLogs,
  useFavoritesFolderHasUnreadLogs,
  useFindFrontendFolderFromUrl,
  useIsFavoriteLogsScreen,
} from "../lib";

type Props = {
  isLoading: boolean;
  refreshLogs: (shouldResetQueryString?: boolean) => Promise<void>;
};

export const LoadUpdatesButton = ({ isLoading, refreshLogs }: Props) => {
  const [lastShowedButton, setLastShowedButton] = useState<Date | null>(null);
  const [shouldShowButton, setShouldShowButton] = useState<boolean>(false);
  const frontendFolder = useFindFrontendFolderFromUrl();
  const isFavoriteLogsScreen = useIsFavoriteLogsScreen();
  const favoritesFolderHasUnreadLogs = useFavoritesFolderHasUnreadLogs();
  const childrenHaveUnreadLogs = useChildrenHasUnreadLogs(frontendFolder, true);
  const channelHasUnreadLogs = isFavoriteLogsScreen
    ? favoritesFolderHasUnreadLogs
    : childrenHaveUnreadLogs;

  const _refresh = async () => refreshLogs(true);

  // we have a timeout here because it takes a second to refetch the folders
  // after fetching the logs, and we don't want to accidentally assume that there are unread
  // logs when we just needed to wait another second or so.
  // Note: This is all just perfecting the UI/UX to eliminate all glitches
  useEffect(() => {
    let timeout;
    if (
      channelHasUnreadLogs &&
      !isLoading &&
      lastShowedButton &&
      moment().diff(moment(lastShowedButton), "seconds") <= 3 /* ||
        moment().diff(moment(lastSwitchedChannels), "seconds") <= 5*/
    ) {
      timeout = setTimeout(() => {
        setShouldShowButton(true);
      }, 1200);
    } else if (channelHasUnreadLogs && !isLoading) {
      // if it has been a while since the button was visible or we haven't seen it yet, it is safe to show immediately
      setShouldShowButton(true);
    } else {
      setShouldShowButton(false);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [channelHasUnreadLogs, isLoading, lastShowedButton]);

  useEffect(() => {
    if (shouldShowButton) {
      setLastShowedButton(new Date());
    }
  }, [shouldShowButton]);

  return shouldShowButton ? (
    <button
      style={styles.container}
      onClick={_refresh}
      disabled={isLoading}
      className="buttonToPress"
    >
      <img src={SyncIcon} style={styles.icon} />
      <label style={styles.text}>See new events</label>
    </button>
  ) : null;
};

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
    paddingTop: 6,
    paddingBottom: 6,
    boxShadow: "0px 2px 1px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
