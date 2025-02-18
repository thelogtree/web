import React, { useMemo } from "react";
import { useLogs } from "../Logs/lib";
import { numberToNumberWithCommas, useSearchParams } from "src/utils/helpers";
import { LogsList } from "../Logs/components/LogsList";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { SearchBar } from "../Logs/components/SearchBar";
import { TopOfSearch } from "./components/TopOfSearch";
import { HypeDescription } from "./components/HypeDescription";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";

export const GlobalSearchScreen = () => {
  const organization = useSelector(getOrganization);
  const { logs, numLogsInTotal, query, setQuery, isSearchQueued } = useLogs();
  const { query: urlQuery } = useSearchParams();

  const numLogsText = useMemo(() => {
    if (isSearchQueued) {
      return "Fetching...";
    } else if (query && logs.length === 1) {
      return "Showing 1 event that matches your query";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent events that match your query`;
    } else if (query) {
      return "No results found.";
    }
    return "";
  }, [numLogsInTotal, logs.length, query, isSearchQueued]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return `No events from the last ${organization?.logRetentionInDays} days match your query.`;
    } else if (query) {
      return "There are no more results.";
    } else if (urlQuery) {
      return "We're preparing your search. One moment please...";
    }
    return "";
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
        {endOfFeedText ? null : <HypeDescription />}
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
