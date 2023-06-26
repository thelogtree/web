import React from "react";
import { FrontendLog, getIndexOfFirstLogAfterToday } from "../lib";
import { LoadingLogs } from "./LoadingLogs";
import { LogsAfterTodayNote } from "./LogsAfterTodayNote";
import { Log } from "./Log";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  logs: FrontendLog[];
  isSearchQueued: boolean;
  isLoading: boolean;
  endOfFeedText: string;
};

export const LogsList = ({
  isLoading,
  isSearchQueued,
  logs,
  endOfFeedText,
}: Props) => {
  const firstIndexOfLogAfterToday = getIndexOfFirstLogAfterToday(logs);

  return (isLoading && !logs.length) || isSearchQueued ? (
    <LoadingLogs />
  ) : (
    <div style={styles.logsFeed}>
      {logs.map((log, i) => (
        <React.Fragment key={`container:${log._id}`}>
          {firstIndexOfLogAfterToday === i && i ? (
            <LogsAfterTodayNote key={`note:${log._id}`} />
          ) : null}
          <Log log={log} key={log._id} />
        </React.Fragment>
      ))}
      {isSearchQueued && !endOfFeedText ? null : (
        <label style={styles.moreResultsLoadingText}>{endOfFeedText}</label>
      )}
    </div>
  );
};

const styles: StylesType = {
  logsFeed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  moreResultsLoadingText: {
    paddingTop: 20,
    color: Colors.gray,
    textAlign: "center",
    width: "100%",
  },
};
