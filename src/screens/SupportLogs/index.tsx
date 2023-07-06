import React, { useEffect, useMemo, useState } from "react";
import { FrontendLog, useLogs } from "../Logs/lib";
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
import _ from "lodash";
import { SignedInOrganization } from "src/screens/SupportLogs/components/SignedInOrganization";
import { ManageConnectionsButton } from "./components/ManageConnectionsButton";

export const SupportLogsScreen = () => {
  useFetchFoldersOnce();
  const organization = useSelector(getOrganization);
  const {
    logs,
    query,
    setQuery,
    isSearchQueued,
    shouldShowLoadingSigns,
    filteredSources,
    setFilteredSources,
    logSourcesOptionsToFilterBy,
    isLoading,
  } = useLogs();
  const [keywordFilter, setKeywordFilter] = useState<string>("");
  const logsToShow = useMemo(() => {
    if (!keywordFilter) {
      return logs;
    }
    return logs.filter((log) => log.content.includes(keywordFilter));
  }, [logs.length, filteredSources.length, isSearchQueued, keywordFilter]);
  const { query: urlQuery } = useSearchParams();

  useEffect(() => {
    setKeywordFilter("");
    setFilteredSources([]);
  }, [query]);

  const numLogsText = useMemo(() => {
    if (shouldShowLoadingSigns) {
      return "Sit tight...it may take up to 30 seconds to find all relevant events";
    } else if (
      query &&
      logsToShow.length &&
      (keywordFilter || filteredSources.length)
    ) {
      if (logsToShow.length === 1) {
        return "Showing 1 event under this filter for this user";
      }
      return `Showing ${logsToShow.length} events under this filter for this user`;
    } else if (
      query &&
      !logsToShow.length &&
      (keywordFilter || filteredSources.length)
    ) {
      return "No results under this filter were found";
    } else if (query && logsToShow.length === 1) {
      return "Showing 1 recent event for this user";
    } else if (query && logsToShow.length) {
      return `Showing the ${numberToNumberWithCommas(
        logsToShow.length
      )} most recent events for this user`;
    }
    return "";
  }, [
    logsToShow.length,
    query,
    shouldShowLoadingSigns,
    filteredSources.length,
    keywordFilter,
  ]);

  const endOfFeedText = useMemo(() => {
    if (logsToShow.length && (keywordFilter || filteredSources.length)) {
      return "There are no more results under your filter.";
    } else if (
      (query || urlQuery) &&
      !logsToShow.length &&
      (keywordFilter || filteredSources.length)
    ) {
      return "There are no results under your filter.";
    } else if (query && !logsToShow.length) {
      return "There are no recent events for this user.";
    } else if (query) {
      return "There are no more recent results.";
    } else if (urlQuery) {
      return "We're preparing your search. One moment please...";
    }
    return "";
  }, [
    logsToShow.length,
    query,
    isSearchQueued,
    urlQuery,
    filteredSources.length,
    keywordFilter,
  ]);

  if (!organization) {
    return null;
  }

  return (
    <>
      <div style={styles.outerContainer}>
        <div style={styles.container}>
          <div style={styles.top}>
            <SignedInOrganization />
          </div>
          <TopOfSearch
            numLogsText={numLogsText}
            filterOptions={logSourcesOptionsToFilterBy}
            filteredSources={filteredSources}
            setFilteredSources={setFilteredSources}
            query={query}
            setQuery={setQuery}
            showFilters={!!logs.length && !isLoading}
            keywordFilter={keywordFilter}
            setKeywordFilter={setKeywordFilter}
            isLoading={shouldShowLoadingSigns}
          />
          <LogsList
            shouldShowLoadingSigns={shouldShowLoadingSigns}
            logs={logsToShow}
            endOfFeedText={endOfFeedText}
          />
        </div>
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
    width: "90%",
    overflow: "auto",
    maxWidth: 1200,
  },
  outerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 60,
    paddingTop: 20,
    overflow: "auto",
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
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
};
