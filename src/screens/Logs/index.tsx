import { Tooltip } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { Colors } from "src/utils/colors";
import { numberToNumberWithCommas } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

import { FavoriteButton } from "./components/FavoriteButton";
import { LoadingLogs } from "./components/LoadingLogs";
import { Log } from "./components/Log";
import { SearchBar } from "./components/SearchBar";
import {
  getIndexOfFirstLogAfterToday,
  useFindFrontendFolderFromUrl,
  useIsFavoriteLogsScreen,
  useLogs,
} from "./lib";
import { LoadUpdatesButton } from "./components/LoadUpdatesButton";
import { LogsAfterTodayNote } from "./components/LogsAfterTodayNote";
import { DateFilter } from "./components/DateFilter";
import { Stat } from "./components/Stat";
import { ChannelDescription } from "./components/ChannelDescription";

export const LogsScreen = () => {
  const frontendFolder = useFindFrontendFolderFromUrl();
  const isFavoriteLogsScreen = useIsFavoriteLogsScreen();
  const {
    logs,
    numLogsInTotal,
    isLoading,
    attemptFetchingMoreResults,
    query,
    setQuery,
    isSearchQueued,
    freshQueryAndReset,
    isDateFilterApplied,
  } = useLogs(frontendFolder?._id);
  const containerRef = useRef(null);
  const firstIndexOfLogAfterToday = getIndexOfFirstLogAfterToday(logs);

  const numLogsText = useMemo(() => {
    if (isLoading || isSearchQueued) {
      return "Fetching...";
    } else if (query && logs.length === 1) {
      return "Showing 1 log that matches your query";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent logs that match your query`;
    } else if (numLogsInTotal === 1 && !query) {
      return "Showing 1 log";
    } else if (query || (isDateFilterApplied && !logs.length)) {
      return "No results found.";
    } else if (!isDateFilterApplied && numLogsInTotal) {
      return `Showing all ${numberToNumberWithCommas(numLogsInTotal)} logs`;
    }
    return `Showing ${numberToNumberWithCommas(numLogsInTotal)} logs`;
  }, [
    numLogsInTotal,
    logs.length,
    query,
    isLoading,
    isSearchQueued,
    isDateFilterApplied,
  ]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return "No logs from the last 14 days match your query.";
    } else if (isDateFilterApplied && !logs.length) {
      return "No logs from this time period.";
    } else if (
      logs.length === numLogsInTotal &&
      !numLogsInTotal &&
      !isFavoriteLogsScreen
    ) {
      return "This channel has no logs in it yet.";
    } else if (logs.length === numLogsInTotal && !numLogsInTotal) {
      return "Logs from channels you like will show up here.";
    } else if (query || logs.length === numLogsInTotal) {
      return "There are no more results.";
    }
    return "Fetching more results...";
  }, [logs.length, numLogsInTotal, query, isDateFilterApplied]);

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

  return frontendFolder || isFavoriteLogsScreen ? (
    <>
      <SearchBar query={query} setQuery={setQuery} />
      <div style={styles.container} ref={containerRef} onScroll={_handleScroll}>
        <div style={styles.topContainer}>
          <div style={styles.verticalTop}>
            <div style={styles.titleContainer}>
              <label style={styles.folderName}>
                {isFavoriteLogsScreen ? "My Favorites" : frontendFolder!.name}
              </label>
              {!isFavoriteLogsScreen && (
                <>
                  <FavoriteButton />
                  <Tooltip title="This channel's folderPath">
                    <label style={styles.fullPath}>
                      {frontendFolder!.fullPath}
                    </label>
                  </Tooltip>
                  <LoadUpdatesButton
                    refreshLogs={freshQueryAndReset}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
            <ChannelDescription />
            <label style={styles.numLogsTotalText}>{numLogsText}</label>
          </div>
          <div style={styles.verticalTopRight}>
            <Stat numLogs={numLogsInTotal} />
            <DateFilter
              doesQueryExist={isSearchQueued || !!query}
              freshQueryAndReset={freshQueryAndReset}
            />
          </div>
        </div>
        {(isLoading && !logs.length) || isSearchQueued ? (
          <LoadingLogs />
        ) : (
          <div style={styles.logsFeed}>
            <hr style={styles.hr} />
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
    paddingRight: 6,
  },
  numLogsTotalText: {
    paddingBottom: 0,
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
    paddingBottom: 15,
    width: "100%",
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 40,
    paddingBottom: 15,
    width: "100%",
  },
  fullPath: {
    color: Colors.gray,
    fontSize: 13,
    position: "relative",
    top: 2,
    paddingLeft: 15,
  },
  verticalTop: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    width: "100%",
  },
  verticalTopRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "50%",
  },
};
