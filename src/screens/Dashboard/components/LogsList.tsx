import React, { useState } from "react";
import {
  FrontendLog,
  getIndexOfFirstLogAfterToday,
} from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { LogRow } from "./LogRow";

type Props = {
  logs: FrontendLog[];
};

export const LogsList = ({ logs }: Props) => {
  const [lastLogIndexInView, setLastLogIndexInView] = useState<number>(0);
  const firstIndexOfLogAfterToday = getIndexOfFirstLogAfterToday(logs);
  const endOfFeedText =
    logs.length >= 50
      ? "There are more events not shown."
      : "There are no more events to show.";

  return logs.length ? (
    <div style={styles.logsFeed}>
      {logs.map((log, i) => (
        <LogRow
          isFirstLogAfterToday={Boolean(firstIndexOfLogAfterToday === i && i)}
          log={log}
          setLastLogIndexInView={setLastLogIndexInView}
          lastLogIndexInView={lastLogIndexInView}
          index={i}
        />
      ))}
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
