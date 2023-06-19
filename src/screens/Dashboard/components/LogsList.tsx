import React from "react";
import {
  FrontendLog,
  getIndexOfFirstLogAfterToday,
} from "src/screens/Logs/lib";
import { LogsAfterTodayNote } from "src/screens/Logs/components/LogsAfterTodayNote";
import { Log } from "src/screens/Logs/components/Log";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  logs: FrontendLog[];
};

export const LogsList = ({ logs }: Props) => {
  const firstIndexOfLogAfterToday = getIndexOfFirstLogAfterToday(logs);
  const endOfFeedText =
    logs.length >= 50
      ? "There are more events not shown."
      : "There are no more events to show.";

  return logs.length ? (
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
  ) : null;
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
