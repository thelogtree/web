import React, { useMemo, useRef, useState } from "react";
import { StylesType } from "src/utils/styles";

import { Log } from "./components/Log";
import { useFindFrontendFolderFromUrl, useLogs } from "./lib";
import { LoadingLogs } from "./components/LoadingLogs";
import { Colors } from "src/utils/colors";
import { SearchBar } from "./components/SearchBar";
import { Options } from "./components/Options";
import { numberToNumberWithCommas } from "src/utils/helpers";

export const LogsScreen = () => {
  const frontendFolder = useFindFrontendFolderFromUrl();
  const {
    logs,
    numLogsInTotal,
    isLoading,
    attemptFetchingMoreResults,
    query,
    setQuery,
    isSearchQueued,
  } = useLogs(frontendFolder?._id);
  const containerRef = useRef(null);

  const numLogsText = useMemo(() => {
    if (isLoading || isSearchQueued) {
      return "";
    } else if (query && logs.length === 1) {
      return "Showing 1 log that matches your query";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent logs that match your query`;
    } else if (numLogsInTotal === 1) {
      return "Showing 1 log";
    }
    return `Showing ${numberToNumberWithCommas(numLogsInTotal)} logs`;
  }, [numLogsInTotal, logs.length, query, isLoading, isSearchQueued]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return "No logs from the last 14 days match your query";
    } else if (logs.length === numLogsInTotal && !numLogsInTotal) {
      return "This channel has no logs in it yet.";
    } else if (query || logs.length === numLogsInTotal) {
      return "There are no more results.";
    }
    return "Fetching more results...";
  }, [logs.length, numLogsInTotal, query]);

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
    <>
      <SearchBar query={query} setQuery={setQuery} />
      <div style={styles.container} ref={containerRef} onScroll={_handleScroll}>
        <div style={styles.titleContainer}>
          <label style={styles.folderName}>{frontendFolder.name}</label>
          <label style={styles.fullPath}>{frontendFolder.fullPath}</label>
        </div>
        {numLogsInTotal ? (
          <label style={styles.numLogsTotalText}>{numLogsText}</label>
        ) : null}
        {(isLoading && !logs.length) || isSearchQueued ? (
          <LoadingLogs />
        ) : (
          <div style={styles.logsFeed}>
            <hr style={styles.hr} />
            {logs.map((log) => (
              <Log log={log} key={log._id} />
            ))}
            {isSearchQueued ? null : (
              <label style={styles.moreResultsLoadingText}>
                {endOfFeedText}
              </label>
            )}
          </div>
        )}
      </div>
    </>
  ) : null;
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 60,
    paddingTop: 20,
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
    textAlign: "left",
    width: "100%",
    paddingRight: 20,
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
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 15,
  },
  fullPath: {
    color: Colors.gray,
    fontSize: 13,
    minWidth: 300,
    position: "relative",
    top: 2,
  },
};
