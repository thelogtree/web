import * as Sentry from "@sentry/react";
import _ from "lodash";
import { simplifiedLogTagEnum } from "logtree-types";
import moment from "moment-timezone";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Api } from "src/api";
import { useFetchFolders } from "src/redux/actionIndex";
import {
  getFavoriteFolderPaths,
  getFolders,
  getOrganization,
} from "src/redux/organization/selector";
import {
  CONNECTION_ROUTE_PREFIX,
  LOGS_ROUTE_PREFIX,
  SUPPORT_TOOL_SUFFIX,
} from "src/RouteManager";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import {
  isValidJsonString,
  showGenericErrorAlert,
  usePathname,
  useSearchParams,
} from "src/utils/helpers";
import stringify from "json-stringify-pretty-compact";

import { useCurrentIntegration } from "../IntegrationLogs/lib";
import { StatHistogram } from "./components/HistogramItem";

export const useFindFrontendFolderFromUrl = () => {
  const folders = useSelector(getFolders);
  const fullFolderPath = useFullFolderPathFromUrl();

  const _dfsThroughFolders = () => {
    if (!folders.length) {
      return;
    }
    let foldersToTraverse: FrontendFolder[] = [];
    foldersToTraverse = folders;
    while (foldersToTraverse.length) {
      const currFolder = foldersToTraverse[0];
      if (currFolder.fullPath === fullFolderPath) {
        return currFolder;
      }
      foldersToTraverse = foldersToTraverse.concat(currFolder.children);
      foldersToTraverse = foldersToTraverse.slice(1);
    }

    return null;
  };

  return _dfsThroughFolders() ?? null;
};

export const useFullFolderPathFromUrl = () => {
  const path = usePathname();

  const fullFolderPath = useMemo(() => {
    const whereFolderPathStarts =
      path.indexOf(LOGS_ROUTE_PREFIX) + LOGS_ROUTE_PREFIX.length;
    return path.substring(whereFolderPathStarts);
  }, [path]);

  return fullFolderPath;
};

export const useConnectionPathFromUrl = () => {
  const path = usePathname();

  const connectionPath = useMemo(() => {
    const whereConnectionPathStarts =
      path.indexOf(CONNECTION_ROUTE_PREFIX) +
      CONNECTION_ROUTE_PREFIX.length +
      1;
    return path.substring(whereConnectionPathStarts);
  }, [path]);

  return connectionPath;
};

export type FrontendLog = {
  content: string;
  _id: string;
  createdAt: Date;
  folderId?: string;
  folderFullPath?: string;
  referenceId?: string;
  externalLink?: string;
  tag?: simplifiedLogTagEnum;
  sourceTitle?: string;
  additionalContext?: Object;
};

const PAGINATION_RECORDS_INCREMENT = 50; // cannot be more than 50 because the backend only returns 50

export const useLogs = (
  folderId?: string,
  overrideInitialLoadingState?: boolean
) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const isSupportScreen = useIsSupportLogsScreen();
  const isFavoritesScreen = useIsFavoriteLogsScreen();
  const favoritesScreenHasUnread = useFavoritesFolderHasUnreadLogs();
  const isGlobalSearchScreen = useIsGlobalSearchScreen();
  const frontendFolder = useFindFrontendFolderFromUrl();
  const isIntegrationsScreen = useIsIntegrationLogsScreen();
  const connectionUrl = useConnectionPathFromUrl();
  const { currentIntegration, currentIntegrationFromMap } =
    useCurrentIntegration();
  const flattenedFolders = useFlattenedFolders();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const favoritedFolderPaths = useSelector(getFavoriteFolderPaths);
  const queryParams = useSearchParams();
  const urlQuery = queryParams.query || "";
  const [hasSkippedFirstRender, setHasSkippedFirstRender] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(
    overrideInitialLoadingState || !!urlQuery
  );
  const [logs, setLogs] = useState<FrontendLog[]>([]);
  const logsIds = useMemo(() => {
    return logs.map((logs) => logs._id);
  }, [isLoading, logs.length]);
  const [numLogsInTotal, setNumLogsInTotal] = useState<number>(0);
  const [isDateFilterApplied, setIsDateFilterApplied] =
    useState<boolean>(false);
  const [logsNoNewerThanDate, setLogsNoNewerThanDate] = useState<
    Date | undefined
  >(undefined);
  const [logsNoOlderThanDate, setLogsNoOlderThanDate] = useState<
    Date | undefined
  >(undefined);
  const [start, setStart] = useState<number>(0);
  const [query, setQuery] = useState<string>(urlQuery);
  const [lastSearchCompletedWithQuery, setLastSearchCompletedWithQuery] =
    useState<string>("");
  const [
    lastCompletedFetchWithConnectionUrl,
    setLastCompletedFetchWithConnectionUrl,
  ] = useState<string>("");
  const [isSearchQueued, setIsSearchQueued] = useState<boolean>(!!urlQuery);
  const [filteredSources, setFilteredSources] = useState<string[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<FrontendLog[]>([]);
  const { fetch: refetchFolders, isFetching: isFetchingFolders } =
    useFetchFolders();
  const shouldShowLoadingSigns = connectionUrl
    ? Boolean(
        (isLoading ||
          isSearchQueued ||
          (query && lastSearchCompletedWithQuery !== query)) &&
          (query || currentIntegrationFromMap?.showsLogsWhenThereIsNoQuery)
      )
    : Boolean(
        isLoading ||
          isSearchQueued ||
          (query && lastSearchCompletedWithQuery !== query)
      );
  const logSourcesOptionsToFilterBy = useMemo(() => {
    const sources = logs.map((log) => log.sourceTitle);
    return _.uniq(sources).filter((v) => v) as string[];
  }, [isSearchQueued, isLoading, logs.length]);

  const attemptFetchingMoreResults = async () => {
    setStart(Math.min(logs.length, start + PAGINATION_RECORDS_INCREMENT));
  };

  const freshQueryAndReset = async (
    shouldResetQueryString: boolean = false,
    overrideFloorDate?: Date,
    overrideCeilingDate?: Date,
    shouldResetFloorDate?: boolean
  ) => {
    if (shouldResetQueryString && query) {
      setQuery(""); // this state change will call the fetch logs for us, so we can stop early
    } else {
      setLogs([]);
      setStart(0);
      await _fetchLogs(
        true,
        overrideFloorDate,
        overrideCeilingDate,
        shouldResetFloorDate
      ); // override the "start" pagination index so we don't have to wait for react state to update
    }
  };

  const _addFolderPathToLogsIfPossible = (
    logs: FrontendLog[]
  ): FrontendLog[] => {
    if (!logs.length) {
      return [];
    }
    if (
      !isFavoritesScreen &&
      !isGlobalSearchScreen &&
      !isSupportScreen &&
      !isIntegrationsScreen
    ) {
      // looking inside a specific channel, return as-is
      return logs;
    }

    return logs.map((log) => {
      if (!log.folderId) {
        return log;
      }
      const folderFullPath = flattenedFolders.find(
        (flattenedFolder) => flattenedFolder._id === log.folderId
      )?.fullPath;
      return {
        ...log,
        folderFullPath,
      };
    });
  };

  const _filterLogsBySource = (logs: FrontendLog[]) =>
    logs.filter(
      (log) => log.sourceTitle && filteredSources.includes(log.sourceTitle)
    );

  const _fetchLogs = async (
    isFreshFetch?: boolean,
    overrideFloorDate?: Date,
    overrideCeilingDate?: Date,
    shouldResetFloorDate?: boolean
  ) => {
    try {
      if (
        !organization ||
        (!folderId &&
          !isFavoritesScreen &&
          !isGlobalSearchScreen &&
          !isSupportScreen &&
          !isIntegrationsScreen) ||
        ((isGlobalSearchScreen || isSupportScreen) && !query) ||
        (isIntegrationsScreen &&
          !currentIntegrationFromMap?.showsLogsWhenThereIsNoQuery &&
          !query)
      ) {
        return;
      }

      setIsLoading(true);

      // addresses possible race conditions with pagination and excessive amount of new logs
      let currentDateCeiling =
        overrideCeilingDate ||
        (isFreshFetch ? new Date() : logsNoNewerThanDate);
      if (!currentDateCeiling) {
        currentDateCeiling = new Date();
      }
      setLogsNoNewerThanDate(currentDateCeiling);

      let currentDateFloor = shouldResetFloorDate
        ? undefined
        : overrideFloorDate ?? logsNoOlderThanDate ?? undefined;

      setIsDateFilterApplied(Boolean(currentDateCeiling && currentDateFloor));
      if (overrideFloorDate) {
        setLogsNoOlderThanDate(overrideFloorDate);
      }
      if (overrideCeilingDate) {
        setLogsNoNewerThanDate(overrideCeilingDate);
      }

      let fetchedLogs: FrontendLog[] = [];
      let fetchedNumLogsInTotal: number = 0;
      if (query) {
        let res;
        if (isSupportScreen) {
          res = await Api.organization.getSupportLogs(
            organization._id.toString(),
            query
          );
        } else if (isIntegrationsScreen) {
          res = await Api.organization.getIntegrationLogs(
            organization._id.toString(),
            currentIntegration!._id.toString(),
            query
          );
        } else {
          res = await Api.organization.searchForLogs(
            organization._id.toString(),
            query,
            folderId,
            isFavoritesScreen
          );
        }
        fetchedLogs = res.data.logs;
      } else if (!isGlobalSearchScreen && !isSupportScreen) {
        if (isIntegrationsScreen) {
          const res = await Api.organization.getIntegrationLogs(
            organization._id.toString(),
            currentIntegration!._id.toString(),
            query
          );
          fetchedLogs = res.data.logs;
        } else {
          const res = await Api.organization.getLogs(
            organization._id.toString(),
            folderId,
            isFavoritesScreen,
            isFreshFetch ? 0 : start,
            currentDateCeiling,
            currentDateFloor
          );
          fetchedNumLogsInTotal = res.data.numLogsInTotal;
          fetchedLogs = res.data.logs;
        }
      }

      setLastCompletedFetchWithConnectionUrl(connectionUrl || "");
      setLastSearchCompletedWithQuery(query);

      setNumLogsInTotal(fetchedNumLogsInTotal);
      let newLogsArr = _.uniqBy(
        (isFreshFetch ? [] : logs).concat(fetchedLogs),
        "_id"
      );

      setLogs(newLogsArr);

      let hadUnreadLogs = isFavoritesScreen
        ? favoritesScreenHasUnread
        : frontendFolder?.hasUnreadLogs;
      if (isFreshFetch && hadUnreadLogs) {
        refetchFolders(); // refresh the unread status of the folder
      }
    } catch (e) {
      setLogs([]);
      setLastCompletedFetchWithConnectionUrl(connectionUrl || "");
      setLastSearchCompletedWithQuery(query);
      console.error(e);
      // showGenericErrorAlert(e);
    }
    setIsLoading(false);
    setIsSearchQueued(false);
  };

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs.length, isLoading, isSearchQueued]);

  useEffect(() => {
    if (start !== 0) {
      // only used for fetching more results in pagination
      _fetchLogs();
    }
  }, [start]);

  useEffect(() => {
    if (!isDateFilterApplied) {
      setLogsNoOlderThanDate(undefined);
      // don't need to set logsNoNewerThanDate because that is already handled in the fetch fxn
    }
  }, [isDateFilterApplied]);

  useEffect(() => {
    if (filteredSources.length) {
      setFilteredLogs(
        _addFolderPathToLogsIfPossible(_filterLogsBySource(logs))
      );
    } else {
      setLogs(_addFolderPathToLogsIfPossible(logs));
    }
  }, [
    isFavoritesScreen,
    isGlobalSearchScreen,
    isSupportScreen,
    isIntegrationsScreen,
    favoritedFolderPaths.length,
    filteredSources.length,
    JSON.stringify(logsIds),
  ]);

  useEffect(() => {
    setIsSearchQueued(!!query);
    setIsDateFilterApplied(false);
    let typingTimer;
    params.set("query", query);
    history.replace({
      pathname: location.pathname,
      search: query ? `?${params.toString()}` : "",
    });
    if (query) {
      typingTimer = setTimeout(() => {
        freshQueryAndReset();
      }, 600);
    } else {
      freshQueryAndReset(undefined, undefined, undefined, true);
    }
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [query, folderId, currentIntegration?._id, organization?._id]);

  useEffect(() => {
    if ((urlQuery || "") !== query) {
      setTimeout(() => {
        setQuery(urlQuery);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (hasSkippedFirstRender) {
      setQuery("");
    } else {
      setHasSkippedFirstRender(true);
    }
  }, [connectionUrl]);

  useEffect(() => {
    if (!query && (isGlobalSearchScreen || isSupportScreen)) {
      setIsLoading(false);
    }
  }, [isGlobalSearchScreen, isSupportScreen, query]);

  const logsToReturn = useMemo(() => {
    if (
      lastSearchCompletedWithQuery === query &&
      lastCompletedFetchWithConnectionUrl === connectionUrl
    ) {
      if (filteredSources.length) {
        return filteredLogs;
      }
      return logs;
    }
    return [];
  }, [
    query,
    lastSearchCompletedWithQuery,
    lastCompletedFetchWithConnectionUrl,
    connectionUrl,
    logs.length,
    isLoading,
    isSearchQueued,
    filteredLogs.length,
    filteredSources.length,
  ]);

  return {
    logs: logsToReturn,
    numLogsInTotal,
    isLoading,
    attemptFetchingMoreResults,
    query,
    setQuery,
    isSearchQueued,
    freshQueryAndReset,
    setLogsNoNewerThanDate,
    isDateFilterApplied,
    isFetchingFolders,
    shouldShowLoadingSigns,
    setFilteredSources,
    filteredSources,
    logSourcesOptionsToFilterBy,
  };
};

export const useIsFavoriteLogsScreen = () => {
  const organization = useSelector(getOrganization);
  const pathname = usePathname();
  const isFavoritesScreen = useMemo(() => {
    return pathname.indexOf(`/org/${organization?.slug}/favorites`) === 0;
  }, [organization?._id, pathname]);

  return isFavoritesScreen;
};

export const useIsSupportLogsScreen = () => {
  const organization = useSelector(getOrganization);
  const pathname = usePathname();
  const isSupportScreen = useMemo(() => {
    return (
      pathname.indexOf(`/org/${organization?.slug}${SUPPORT_TOOL_SUFFIX}`) === 0
    );
  }, [organization?._id, pathname]);

  return isSupportScreen;
};

export const useIsGlobalSearchScreen = () => {
  const organization = useSelector(getOrganization);
  const pathname = usePathname();
  const isGlobalSearchScreen = useMemo(() => {
    return pathname.indexOf(`/org/${organization?.slug}/search`) === 0;
  }, [organization?._id, pathname]);

  return isGlobalSearchScreen;
};

export const useIsIntegrationLogsScreen = () => {
  const organization = useSelector(getOrganization);
  const pathname = usePathname();
  const isIntegrationsScreen = useMemo(() => {
    return (
      pathname.indexOf(
        `/org/${organization?.slug}${CONNECTION_ROUTE_PREFIX}`
      ) === 0
    );
  }, [organization?._id, pathname]);

  return isIntegrationsScreen;
};

type FlattenedFolder = {
  _id: string;
  fullPath: string;
  hasUnreadLogs: boolean;
  isMuted: boolean;
};

export const useFlattenedFolders = (
  overrideFolders?: FrontendFolder[],
  filterForOnlyChannels?: boolean
): FlattenedFolder[] => {
  const folders = useSelector(getFolders);

  const _flattenFolders = (folders: FrontendFolder[]) =>
    folders.reduce((acc: FrontendFolder[], folder) => {
      acc.push(folder);
      if (folder.children && folder.children.length > 0) {
        acc.push(..._flattenFolders(folder.children));
      }
      return acc;
    }, []);

  const _getFinalResult = () => {
    if (filterForOnlyChannels) {
      return _flattenFolders(overrideFolders || folders)
        .filter((folder) => !folder.children.length)
        .map((folder) => ({
          _id: folder._id,
          fullPath: folder.fullPath,
          hasUnreadLogs: folder.hasUnreadLogs,
          isMuted: folder.isMuted,
        }));
    }
    return _flattenFolders(overrideFolders || folders).map((folder) => ({
      _id: folder._id,
      fullPath: folder.fullPath,
      hasUnreadLogs: folder.hasUnreadLogs,
      isMuted: folder.isMuted,
    }));
  };

  return _getFinalResult();
};

export const useFavoritesFolderHasUnreadLogs = () => {
  const flattenedFolders = useFlattenedFolders(undefined, true);
  const favoritedFolderPaths = useSelector(getFavoriteFolderPaths);

  const favoritesFolderHasUnread = Boolean(
    flattenedFolders.find(
      (folder) =>
        folder.hasUnreadLogs && favoritedFolderPaths.includes(folder.fullPath)
    )
  );

  return favoritesFolderHasUnread;
};

// returns true if any children or this channel has unread logs
export const useChildrenHasUnreadLogs = (
  folderOrChannel: FrontendFolder | null,
  includeMutedChannels: boolean = false
) => {
  const flattenedSubfoldersForThisFolder = useFlattenedFolders(
    folderOrChannel ? [folderOrChannel] : [],
    true
  );

  return !!flattenedSubfoldersForThisFolder.find(
    (f) => f.hasUnreadLogs && (includeMutedChannels ? true : !f.isMuted)
  );
};

export const getIndexOfFirstLogAfterToday = (logs: FrontendLog[]) => {
  let firstIndex = -1;
  for (let i = 0; i < logs.length; i++) {
    const logCreatedAt = moment(logs[i].createdAt);
    const isToday = logCreatedAt.isSame(new Date(), "day");
    if (!isToday) {
      firstIndex = i;
      break;
    }
  }
  return firstIndex;
};

export const useFolderStats = (numLogs: number) => {
  const organization = useSelector(getOrganization);
  const currentFolder = useFindFrontendFolderFromUrl();
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [timeInterval, setTimeInterval] = useState<"hour" | "day">("hour");
  const [logFrequencies, setLogFrequencies] = useState<number[]>([]);
  const [numLogsToday, setNumLogsToday] = useState<number>(0);
  const [histograms, setHistograms] = useState<StatHistogram[]>([]);
  const [moreHistogramsAreNotShown, setMoreHistogramsAreNotShown] =
    useState<boolean>(false);
  const [isHistogramByReferenceId, setIsHistogramByReferenceId] =
    useState<boolean>(false);
  const [lastXDays, setLastXDays] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extendedPhrasing = useMemo(() => {
    return `${Math.abs(percentageChange)}% ${
      percentageChange > 0 ? "more" : "fewer"
    } events in the last ${timeInterval} compared to what it is on average in the last 30 ${timeInterval}s.`;
  }, [timeInterval, percentageChange]);

  const _fetch = async (
    isHistogramByReferenceIdTemp: boolean,
    overrideLastXDays?: number
  ) => {
    try {
      if (isLoading || !organization || !currentFolder?._id) {
        return;
      }
      setIsLoading(true);
      const res = await Api.organization.getFolderStats(
        organization!._id.toString(),
        currentFolder!._id,
        isHistogramByReferenceIdTemp,
        overrideLastXDays || lastXDays
      );
      const {
        percentageChange: fetchedPercentageChange,
        timeInterval: fetchedTimeInterval,
        logFrequencies: fetchedLogFrequencies,
        numLogsToday: fetchedNumLogsToday,
        histograms: fetchedHistograms,
        moreHistogramsAreNotShown: fetchedMoreHistogramsAreNotShown,
      } = res.data;
      setPercentageChange(fetchedPercentageChange);
      setTimeInterval(fetchedTimeInterval);
      setLogFrequencies((fetchedLogFrequencies as number[]).reverse());
      setNumLogsToday(fetchedNumLogsToday);
      setHistograms(fetchedHistograms);
      setMoreHistogramsAreNotShown(fetchedMoreHistogramsAreNotShown);
    } catch (e) {
      setPercentageChange(0);
      setNumLogsToday(0);
      setLogFrequencies([]);
      setHistograms([]);
      setMoreHistogramsAreNotShown(false);
      Sentry.captureException(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsHistogramByReferenceId(false);
    setPercentageChange(0);
    setNumLogsToday(0);
    setLogFrequencies([]);
    setHistograms([]);
    setMoreHistogramsAreNotShown(false);
    setLastXDays(1);
    _fetch(false, 1);
  }, [currentFolder?._id]);

  useEffect(() => {
    _fetch(isHistogramByReferenceId, lastXDays);
  }, [numLogs, isHistogramByReferenceId, lastXDays]);

  // for histograms
  const switchTimeInterval = () => {
    if (lastXDays === 1) {
      setLastXDays(organization?.logRetentionInDays || 30);
    } else {
      setLastXDays(1);
    }
  };
  const is24HourTimeframe = lastXDays === 1;

  return {
    percentageChange,
    timeInterval,
    extendedPhrasing,
    logFrequencies,
    numLogsToday,
    histograms,
    moreHistogramsAreNotShown,
    isHistogramByReferenceId,
    setIsHistogramByReferenceId,
    isLoading,
    is24HourTimeframe,
    switchTimeInterval,
  };
};

export const useExternalLinkForLog = (log: FrontendLog) => {
  const url = useMemo(() => {
    if (!log.externalLink) {
      return "";
    }
    return log.externalLink?.includes("http://") ||
      log.externalLink?.includes("https://")
      ? log.externalLink
      : "https://" + log.externalLink;
  }, [log.externalLink]);

  return url;
};

export const SECONDS_TO_DELETE_LOG = 3;
export const useDeleteLog = (logId: string) => {
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const isOnSupportScreen = useIsSupportLogsScreen();
  const shouldShowAsDeleted = isDeleted || isLoading;

  useEffect(() => {
    if (isOnSupportScreen) {
      return;
    }
    let timeout;
    if (isMouseDown) {
      timeout = setTimeout(() => {
        _deleteLog();
      }, SECONDS_TO_DELETE_LOG * 1000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isMouseDown]);

  const _deleteLog = async () => {
    if (isLoading || isDeleted || isOnSupportScreen) {
      return;
    }
    try {
      setIsLoading(true);
      await Api.organization.deleteLog(organization!._id.toString(), logId);
      setIsDeleted(true);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const onMouseDown = () => {
    if (!isLoading && !isDeleted && !isOnSupportScreen) {
      setIsMouseDown(true);
    }

    // don't delete any logs if the user is currently highlighting text
    const isTextHighlightedBoolean = Boolean(window.getSelection()?.toString());
    if (isTextHighlightedBoolean) {
      onMouseUp();
    }
  };

  const onMouseUp = () => {
    if (!isOnSupportScreen) {
      setIsMouseDown(false);
    }
  };

  const onMouseMove = () => {
    if (!isMouseDown) {
      return;
    }

    // don't delete any logs if the user is currently highlighting text
    const isTextHighlightedBoolean = Boolean(window.getSelection()?.toString());
    if (isTextHighlightedBoolean) {
      onMouseUp();
    }
  };

  return {
    shouldShowAsDeleted,
    onMouseDown,
    isMouseDown,
    onMouseUp,
    onMouseMove,
  };
};

export const useAdditionalContextOfLog = (log: FrontendLog) => {
  const additionalContextString = useMemo(() => {
    let result = "";
    const additionalContext = log.additionalContext;
    if (!additionalContext || !Object.keys(additionalContext).length) {
      return result;
    }
    let lastKey = "";
    Object.keys(additionalContext).forEach((key) => {
      if (result) {
        result += `\n`;
      }
      let value = additionalContext[key];
      if (typeof value === "object") {
        value = stringify(value, { indent: 5 });
      } else if (isValidJsonString(value)) {
        value = stringify(JSON.parse(value), { indent: 5 });
      } else if (typeof value === "string") {
        value = `"${value}"`;
      }
      result += `${key}: ${value}`;
      lastKey = key;
    });
    return result;
  }, [log._id]);

  return additionalContextString;
};

export const useAdditionalContextOfLogManager = (log: FrontendLog) => {
  const [isShowingAdditionalContext, setIsShowingAdditionalContext] =
    useState<boolean>(false);
  const additionalContextString = useAdditionalContextOfLog(log);

  return {
    isShowingAdditionalContext,
    setIsShowingAdditionalContext,
    additionalContextString,
  };
};
