import "./index.css";

import React, { useMemo } from "react";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";

import { RefreshButton } from "./components/RefreshButton";
import { useInsights } from "./lib";
import { InsightsTable } from "./components/InsightsTable";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { CenteredLoadingSpinner } from "./components/CenteredLoadingSpinner";
import { Colors } from "src/utils/colors";
import { HigherPriorityInsights } from "./components/HigherPriorityInsights";

export const InsightsScreen = () => {
  const {
    insightsOfNotMostCheckedFolders,
    insightsOfMostCheckedFolders,
    isLoading,
    refetchInsights,
  } = useInsights();
  const shouldShowInsightTables =
    !!insightsOfMostCheckedFolders.length ||
    !!insightsOfNotMostCheckedFolders.length;

  const firstTitle = useMemo(() => {
    if (isLoading) {
      return "Searching for trends...";
    } else if (!!insightsOfMostCheckedFolders.length) {
      return "Trends for you";
    }
    return "All trends";
  }, [
    isLoading,
    !!insightsOfMostCheckedFolders.length,
    !!insightsOfNotMostCheckedFolders.length,
  ]);

  return (
    <div style={styles.container}>
      <div style={styles.topContainer}>
        <label style={styles.title}>{firstTitle}</label>
        <RefreshButton isLoading={isLoading} refresh={refetchInsights} />
      </div>
      {isLoading ? (
        <CenteredLoadingSpinner />
      ) : shouldShowInsightTables ? (
        <>
          <HigherPriorityInsights insights={insightsOfMostCheckedFolders} />
          <InsightsTable
            insights={insightsOfNotMostCheckedFolders}
            shouldHideTitle={!insightsOfMostCheckedFolders.length}
          />
        </>
      ) : (
        <label style={styles.noTrends}>
          No trends yet. We'll automatically spot trends once you have a couple
          days of event activity.
        </label>
      )}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    padding: 90,
    overflowY: "scroll",
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 25,
    width: "100%",
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
  },
  noTrends: {
    color: Colors.darkGray,
  },
};
