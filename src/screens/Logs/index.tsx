import { Tooltip } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getFolders } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { numberToNumberWithCommas } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

import { ChannelDescription } from "./components/ChannelDescription";
import { DateFilter } from "./components/DateFilter";
import { FavoriteButton } from "./components/FavoriteButton";
import { LoadUpdatesButton } from "./components/LoadUpdatesButton";
import { LogsList } from "./components/LogsList";
import { SearchBar } from "./components/SearchBar";
import { Stat } from "./components/Stat";
import {
  useFindFrontendFolderFromUrl,
  useIsFavoriteLogsScreen,
  useLogs,
} from "./lib";

export const LogsScreen = () => {
  const folders = useSelector(getFolders);
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
    isFetchingFolders,
  } = useLogs(frontendFolder?._id);
  const containerRef = useRef(null);

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
      return "Like the channels you care most about and we'll show you those logs here.";
    } else if (query || logs.length === numLogsInTotal) {
      return "There are no more results.";
    }
    return "Fetching more results...";
  }, [
    logs.length,
    numLogsInTotal,
    query,
    isDateFilterApplied,
    isFavoriteLogsScreen,
  ]);

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

  if (!frontendFolder && !isFavoriteLogsScreen && folders.length) {
    return <div style={styles.deleted}>This channel no longer exists.</div>;
  }

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
                    isLoading={isLoading || isFetchingFolders}
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
        <div style={styles.hrWrapper}>
          <hr style={styles.hr} />
        </div>
        <LogsList
          isLoading={isLoading}
          isSearchQueued={isSearchQueued}
          logs={logs}
          endOfFeedText={endOfFeedText}
        />
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
  folderName: {
    fontWeight: 600,
    fontSize: 30,
    textAlign: "left",
    paddingRight: 6,
  },
  numLogsTotalText: {
    paddingBottom: 0,
    color: Colors.gray,
    fontSize: 13,
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
    minHeight: 170,
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
  hr: {
    border: "none",
    width: "100%",
    backgroundColor: Colors.lightGray,
    height: 1,
    marginBottom: 30,
  },
  hrWrapper: {
    width: "100%",
  },
  deleted: {
    width: "100%",
    textAlign: "center",
    paddingTop: 300,
    color: Colors.darkGray,
  },
};
