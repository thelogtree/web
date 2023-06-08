import React from "react";
import { Log } from "./Log";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import {
  FrontendLog,
  getIndexOfFirstLogAfterToday,
} from "src/screens/Logs/lib";
import { LoadingLogs } from "src/screens/Logs/components/LoadingLogs";
import { LogsAfterTodayNote } from "src/screens/Logs/components/LogsAfterTodayNote";

type Props = {
  logs: FrontendLog[];
  shouldShowLoadingSigns: boolean;
  endOfFeedText: string;
};

export const LogsList = ({
  shouldShowLoadingSigns,
  logs,
  endOfFeedText,
}: Props) => {
  const firstIndexOfLogAfterToday = getIndexOfFirstLogAfterToday(logs);

  return shouldShowLoadingSigns ? (
    <LoadingLogs overridePaddingTop={120} />
  ) : (
    <div style={styles.logsFeed}>
      {logs.map((log, i) => {
        return (
          <React.Fragment key={`container:${log._id}`}>
            {firstIndexOfLogAfterToday === i && i ? (
              <LogsAfterTodayNote key={`note:${log._id}`} />
            ) : null}
            <Log log={log} key={log._id} />
          </React.Fragment>
        );
      })}
      <label style={styles.moreResultsLoadingText}>{endOfFeedText}</label>
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
