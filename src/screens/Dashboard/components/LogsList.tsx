import React, { useMemo, useState } from "react";
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
  const endOfFeedText = useMemo(() => {
    if (logs.length === 0) {
      return "There are no events to show.";
    } else if (logs.length >= 50) {
      return "Only the 50 most recent events are being shown.";
    }
    return "There are no more events to show.";
  }, [logs.length]);

  return (
    <div style={styles.logsFeed}>
      <label style={styles.description}>Live</label>
      {logs.map((log, i) => (
        <LogRow
          isFirstLogAfterToday={Boolean(firstIndexOfLogAfterToday === i && i)}
          log={log}
          setLastLogIndexInView={setLastLogIndexInView}
          lastLogIndexInView={lastLogIndexInView}
          index={i}
        />
      ))}
      <label
        style={{
          ...styles.moreResultsLoadingText,
          ...(!logs.length && { paddingTop: "15%" }),
        }}
      >
        {endOfFeedText}
      </label>
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
    paddingBottom: 40,
  },
  description: {
    color: Colors.gray,
    paddingTop: 6,
    paddingBottom: 12,
  },
  moreResultsLoadingText: {
    paddingTop: 20,
    color: Colors.gray,
    textAlign: "center",
    width: "100%",
  },
};
