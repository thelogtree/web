import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { SignedInOrganization } from "src/screens/SupportLogs/components/SignedInOrganization";
import { Colors } from "src/utils/colors";
import { numberToNumberWithCommas, useSearchParams } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

import { useLogs } from "../Logs/lib";
import { LogsList } from "./components/LogsList";
import { TopOfSearch } from "./components/TopOfSearch";
import { useFetchFoldersOnce, useSelectTab } from "./lib";
import { useTrackPageView } from "src/utils/useTrackPageView";
import { simplifiedLogTagEnum } from "logtree-types";
import { Tabs } from "./components/Tabs";

export const SupportLogsScreen = () => {
  useTrackPageView();
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
    isLoading,
  } = useLogs();
  const { query: urlQuery } = useSearchParams();
  const { selectedTabKey, setSelectedTabKey } =
    useSelectTab(setFilteredSources);
  const shouldShowTabs = Boolean(
    query && !isLoading && !isSearchQueued && !shouldShowLoadingSigns
  );

  const endOfFeedText = useMemo(() => {
    if (logs.length && filteredSources.length) {
      return "There are no more recent events.";
    } else if ((query || urlQuery) && !logs.length && filteredSources.length) {
      return "There are no recent events.";
    } else if (query && !logs.length) {
      return "There are no recent events.";
    } else if (query) {
      return "There are no recent events.";
    } else if (urlQuery) {
      return "We're preparing your search. One moment please...";
    }
    return "";
  }, [
    query,
    isSearchQueued,
    urlQuery,
    JSON.stringify(filteredSources),
    logs.length,
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
            query={query}
            setQuery={setQuery}
            isLoading={shouldShowLoadingSigns}
          />
          {shouldShowTabs ? (
            <Tabs
              selectedTabKey={selectedTabKey}
              onSelectTab={setSelectedTabKey}
            />
          ) : null}
          <LogsList
            shouldShowLoadingSigns={shouldShowLoadingSigns}
            logs={logs}
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
    overflow: "hidden",
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
