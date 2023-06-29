import React, { useEffect, useMemo, useState } from "react";
import { useConnectionPathFromUrl, useLogs } from "../Logs/lib";
import { numberToNumberWithCommas, useSearchParams } from "src/utils/helpers";
import { LogsList } from "./components/LogsList";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { SearchBar } from "./components/SearchBar";
import { TopOfSearch } from "./components/TopOfSearch";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { useCurrentIntegration } from "./lib";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";

export const IntegrationLogsScreen = () => {
  const organization = useSelector(getOrganization);
  const { query: urlQuery } = useSearchParams();
  const connectionUrl = useConnectionPathFromUrl();
  const { currentIntegrationFromMap, currentIntegration } =
    useCurrentIntegration();
  const showsLogsWhenThereIsNoQuery =
    currentIntegrationFromMap?.showsLogsWhenThereIsNoQuery;
  const {
    logs,
    numLogsInTotal,
    query,
    setQuery,
    isSearchQueued,
    shouldShowLoadingSigns,
  } = useLogs();

  const numLogsText = useMemo(() => {
    if (shouldShowLoadingSigns && (query || showsLogsWhenThereIsNoQuery)) {
      return "Fetching...this may take a couple seconds";
    } else if (shouldShowLoadingSigns) {
      return "";
    } else if (query && logs.length === 1) {
      return "Showing 1 recent event for this user";
    } else if (query && logs.length) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent events for this user`;
    } else if (query) {
      return "No recent results found.";
    } else if (showsLogsWhenThereIsNoQuery && logs.length === 1) {
      return "Showing 1 recent event";
    } else if (showsLogsWhenThereIsNoQuery && logs.length > 1) {
      return `Showing the ${numberToNumberWithCommas(
        logs.length
      )} most recent events for all users`;
    }
    return "";
  }, [
    numLogsInTotal,
    logs.length,
    query,
    shouldShowLoadingSigns,
    showsLogsWhenThereIsNoQuery,
  ]);

  const endOfFeedText = useMemo(() => {
    if (query && !logs.length) {
      return "There are no recent events for this user.";
    } else if (query) {
      return "There are no more recent results.";
    } else if (urlQuery) {
      return "We're preparing your search. One moment please...";
    }
    return "";
  }, [
    logs.length,
    numLogsInTotal,
    query,
    isSearchQueued,
    urlQuery,
    showsLogsWhenThereIsNoQuery,
  ]);

  if (
    !organization ||
    !currentIntegrationFromMap ||
    connectionUrl !== currentIntegration?.type
  ) {
    return <LoadingSpinnerFullScreen />;
  }

  return (
    <>
      <SearchBar query={query} setQuery={setQuery} />
      <div style={styles.container}>
        <TopOfSearch numLogsText={numLogsText} />
        <div style={styles.hrWrapper}>
          <hr style={styles.hr} />
        </div>
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
