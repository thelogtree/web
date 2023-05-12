import React, { useMemo } from "react";
import { useLogs } from "../Logs/lib";
import { numberToNumberWithCommas, useSearchParams } from "src/utils/helpers";
import { LogsList } from "./components/LogsList";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { SearchBar } from "./components/SearchBar";
import { TopOfSearch } from "./components/TopOfSearch";
import { useFetchFoldersOnce } from "./lib";
import { Placeholder } from "./components/Placeholder";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";

export const SupportLogsScreen = () => {
  useFetchFoldersOnce();
  const organization = useSelector(getOrganization);
  const {
    logs,
    numLogsInTotal,
    query,
    setQuery,
    isSearchQueued,
    shouldShowLoadingSigns,
    filtersForOnlyErrors,
    setFiltersForOnlyErrors,
  } = useLogs();
  const { query: urlQuery } = useSearchParams();

  const numLogsText = useMemo(() => {
    if (shouldShowLoadingSigns) {
      return "Fetching...this may take a couple seconds";
    } else if (query && logs.length === 1) {
      return "Showing 1 log that for this user";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent logs for this user`;
    } else if (query) {
      return "No results found.";
    }
    return "";
  }, [numLogsInTotal, logs.length, query, shouldShowLoadingSigns]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return "There are no logs for this user.";
    } else if (query) {
      return "There are no more results.";
    } else if (urlQuery) {
      return "We're preparing your search. One moment please...";
    }
    return "";
  }, [logs.length, numLogsInTotal, query, isSearchQueued, urlQuery]);

  if (!organization) {
    return null;
  }

  return (
    <>
      <SearchBar query={query} setQuery={setQuery} />
      <div style={styles.container}>
        <TopOfSearch
          numLogsText={numLogsText}
          shouldOnlyShowErrors={filtersForOnlyErrors}
          setShouldOnlyShowErrors={setFiltersForOnlyErrors}
        />
        <div style={styles.hrWrapper}>
          <hr style={styles.hr} />
        </div>
        <LogsList
          shouldShowLoadingSigns={shouldShowLoadingSigns}
          logs={logs}
          endOfFeedText={endOfFeedText}
        />
        {!query && !urlQuery ? <Placeholder /> : null}
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
