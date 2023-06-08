import React, { useMemo, useState } from "react";
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
  } = useLogs();
  const { query: urlQuery } = useSearchParams();

  const numLogsText = useMemo(() => {
    if (shouldShowLoadingSigns) {
      return "Fetching...this may take a couple seconds";
    } else if (query && logs.length === 1) {
      return "Showing 1 recent log for this user";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent logs for this user`;
    } else if (query) {
      return "No recent results found.";
    }
    return "";
  }, [logs.length, query, shouldShowLoadingSigns]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return "There are no recent logs for this user.";
    } else if (query) {
      return "There are no more recent results.";
    } else if (urlQuery) {
      return "We're preparing your search. One moment please...";
    }
    return "";
  }, [logs.length, query, isSearchQueued, urlQuery]);

  if (!organization) {
    return null;
  }

  return (
    <>
      <div style={styles.container}>
        <TopOfSearch
          numLogsText={numLogsText}
          filterOptions={logSourcesOptionsToFilterBy}
          filteredSources={filteredSources}
          setFilteredSources={setFilteredSources}
          query={query}
          setQuery={setQuery}
        />
        <LogsList
          shouldShowLoadingSigns={shouldShowLoadingSigns}
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
