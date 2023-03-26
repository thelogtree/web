import React, { useMemo, useRef, useState } from "react";
import { StylesType } from "src/utils/styles";

import { Log } from "./components/Log";
import { useFindFrontendFolderFromUrl, useLogs } from "./lib";
import { LoadingLogs } from "./components/LoadingLogs";
import { Colors } from "src/utils/colors";

export const LogsScreen = () => {
  const frontendFolder = useFindFrontendFolderFromUrl();
  const { logs, numLogsInTotal, isLoading, attemptFetchingMoreResults } =
    useLogs(frontendFolder?._id);
  const containerRef = useRef(null);

  const numLogsText = useMemo(() => {
    if (numLogsInTotal === 1) {
      return "Showing 1 log";
    }
    return `Showing ${numLogsInTotal} logs`;
  }, [numLogsInTotal]);

  const _handleScroll = () => {
    const container: any | null = containerRef.current;
    if (
      container &&
      container.scrollTop + container.offsetHeight >=
        container.scrollHeight - 200 // threshold for detecting bottom
    ) {
      attemptFetchingMoreResults();
    }
  };

  return frontendFolder ? (
    <div style={styles.container} ref={containerRef} onScroll={_handleScroll}>
      <label style={styles.folderName}>{frontendFolder.name}</label>
      {numLogsInTotal ? (
        <label style={styles.numLogsTotalText}>{numLogsText}</label>
      ) : null}
      {isLoading && !logs.length ? (
        <LoadingLogs />
      ) : (
        <div style={styles.logsFeed}>
          <hr style={styles.hr} />
          {logs.map((log) => (
            <Log log={log} key={log._id} />
          ))}
          <label style={styles.moreResultsLoadingText}>
            {logs.length === numLogsInTotal
              ? "There are no more results."
              : "Fetching more results..."}
          </label>
        </div>
      )}
    </div>
  ) : null;
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 60,
    overflow: "scroll",
  },
  logsFeed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  folderName: {
    fontWeight: 600,
    fontSize: 30,
    paddingTop: 40,
    textAlign: "left",
    width: "100%",
    paddingBottom: 15,
  },
  numLogsTotalText: {
    paddingBottom: 15,
    color: Colors.darkGray,
    fontSize: 13,
  },
  hr: {
    border: "none",
    width: "100%",
    backgroundColor: Colors.lightGray,
    height: 1,
    marginBottom: 30,
  },
  moreResultsLoadingText: {
    paddingTop: 20,
    color: Colors.gray,
    textAlign: "center",
    width: "100%",
  },
};
