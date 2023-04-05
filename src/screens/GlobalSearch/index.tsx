import React, { useMemo } from "react";
import { useLogs } from "../Logs/lib";
import { numberToNumberWithCommas, useSearchParams } from "src/utils/helpers";
import { LogsList } from "../Logs/components/LogsList";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { SearchBar } from "../Logs/components/SearchBar";
import { TopOfSearch } from "./components/TopOfSearch";

export const GlobalSearchScreen = () => {
  const { logs, numLogsInTotal, query, setQuery, isSearchQueued } = useLogs();
  const { query: urlQuery } = useSearchParams();

  const numLogsText = useMemo(() => {
    if (isSearchQueued) {
      return "Fetching...";
    } else if (query && logs.length === 1) {
      return "Showing 1 log that matches your query";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent logs that match your query`;
    } else if (query) {
      return "No results found.";
    }
    return "";
  }, [numLogsInTotal, logs.length, query, isSearchQueued]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return "No logs from the last 14 days match your query.";
    } else if (query) {
      return "There are no more results.";
    } else if (urlQuery) {
      return "One moment...";
    }
    return "Search something to see results!";
  }, [logs.length, numLogsInTotal, query, isSearchQueued, urlQuery]);

  return (
    <>
      <SearchBar query={query} setQuery={setQuery} />
      <div style={styles.container}>
        <TopOfSearch numLogsText={numLogsText} />
        <div style={styles.hrWrapper}>
          <hr style={styles.hr} />
        </div>
        <LogsList
          isLoading={isSearchQueued}
          isSearchQueued={isSearchQueued}
          logs={logs}
          endOfFeedText={endOfFeedText}
        />
      </div>
    </>
  );
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
};
