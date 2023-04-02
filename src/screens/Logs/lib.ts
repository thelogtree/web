import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { Api } from "src/api";
import {
  getFavoriteFolderPaths,
  getFolders,
  getOrganization,
} from "src/redux/organization/selector";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { showGenericErrorAlert, usePathname } from "src/utils/helpers";
import _ from "lodash";
import { useFetchFolders } from "src/redux/actionIndex";
import moment from "moment-timezone";

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

export type FrontendLog = {
  content: string;
  _id: string;
  createdAt: Date;
  folderId?: string;
  folderFullPath?: string;
  referenceId?: string;
};

const PAGINATION_RECORDS_INCREMENT = 50; // cannot be more than 50 because the backend only returns 50

export const useLogs = (folderId?: string) => {
  const organization = useSelector(getOrganization);
  const isFavoritesScreen = useIsFavoriteLogsScreen();
  const frontendFolder = useFindFrontendFolderFromUrl();
  const flattenedFolders = useFlattenedFolders();
  const favoritedFolderPaths = useSelector(getFavoriteFolderPaths);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<FrontendLog[]>([]);
  const logsIds = useMemo(() => {
    return logs.map((logs) => logs._id);
  }, [isLoading, logs.length]);
  const [numLogsInTotal, setNumLogsInTotal] = useState<number>(0);
  const [logsNoNewerThanDate, setLogsNoNewerThanDate] = useState<
    Date | undefined
  >(undefined);
  const [start, setStart] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [isSearchQueued, setIsSearchQueued] = useState<boolean>(false);
  const { fetch: refetchFolders } = useFetchFolders();

  const attemptFetchingMoreResults = async () => {
    setStart(Math.min(logs.length, start + PAGINATION_RECORDS_INCREMENT));
  };

  const freshQueryAndReset = async (
    shouldResetQueryString: boolean = false
  ) => {
    if (shouldResetQueryString && query) {
      setQuery(""); // this state change will call the fetch logs for us, so we can stop early
    } else {
      setLogs([]);
      setStart(0);
      await _fetchLogs(true); // override the "start" pagination index so we don't have to wait for react state to update
    }
  };

  const _addFolderPathToLogsIfPossible = (
    logs: FrontendLog[]
  ): FrontendLog[] => {
    if (!logs.length) {
      return [];
    }
    if (!logs[0].folderId) {
      // not favorites, return as-is
      return logs;
    }
    return logs.map((log) => {
      const folderFullPath = flattenedFolders.find(
        (flattenedFolder) => flattenedFolder._id === log.folderId
      )?.fullPath;
      return {
        ...log,
        folderFullPath,
      };
    });
  };

  const _fetchLogs = async (isFreshFetch?: boolean) => {
    try {
      if (!organization || (!folderId && !isFavoritesScreen)) {
        return;
      }

      setIsLoading(true);

      // addresses possible race conditions with pagination and excessive amount of new logs
      let currentDateCeiling = isFreshFetch ? new Date() : logsNoNewerThanDate;
      if (!currentDateCeiling) {
        currentDateCeiling = new Date();
        setLogsNoNewerThanDate(currentDateCeiling);
      }

      let fetchedLogs: FrontendLog[] = [];
      if (query) {
        const res = await Api.organization.searchForLogs(
          organization._id.toString(),
          query,
          folderId,
          isFavoritesScreen
        );
        fetchedLogs = res.data.logs;
      } else {
        const res = await Api.organization.getLogs(
          organization._id.toString(),
          folderId,
          isFavoritesScreen,
          isFreshFetch ? 0 : start,
          currentDateCeiling
        );
        const fetchedNumLogsInTotal = res.data.numLogsInTotal;
        fetchedLogs = res.data.logs;
        setNumLogsInTotal(fetchedNumLogsInTotal);
      }
      const newLogsArr = _.uniqBy(
        (isFreshFetch ? [] : logs).concat(fetchedLogs),
        "_id"
      );
      setLogs(newLogsArr);
      setIsLoading(false);

      if (isFreshFetch && frontendFolder?.hasUnreadLogs) {
        refetchFolders(); // refresh the unread status of the folder
      }
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsSearchQueued(false);
  };

  useEffect(() => {
    if (start !== 0) {
      // only used for fetching more results in pagination
      _fetchLogs();
    }
  }, [start]);

  useEffect(() => {
    setLogs(_addFolderPathToLogsIfPossible(logs));
  }, [isFavoritesScreen, favoritedFolderPaths.length, JSON.stringify(logsIds)]);

  useEffect(() => {
    setIsSearchQueued(!!query);
    let typingTimer;
    if (query) {
      typingTimer = setTimeout(() => {
        freshQueryAndReset();
      }, 600);
    } else {
      freshQueryAndReset();
    }
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [query, folderId, organization?._id]);

  useEffect(() => {
    setQuery("");
  }, [folderId]);

  return {
    logs,
    numLogsInTotal,
    isLoading,
    attemptFetchingMoreResults,
    query,
    setQuery,
    isSearchQueued,
    freshQueryAndReset,
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

type FlattenedFolder = {
  _id: string;
  fullPath: string;
  hasUnreadLogs: boolean;
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
        }));
    }
    return _flattenFolders(overrideFolders || folders).map((folder) => ({
      _id: folder._id,
      fullPath: folder.fullPath,
      hasUnreadLogs: folder.hasUnreadLogs,
    }));
  };

  return _getFinalResult();
};

// returns true if any children or this channel has unread logs
export const useChildrenHasUnreadLogs = (
  folderOrChannel: FrontendFolder | null
) => {
  const flattenedSubfoldersForThisFolder = useFlattenedFolders(
    folderOrChannel ? [folderOrChannel] : [],
    true
  );

  return !!flattenedSubfoldersForThisFolder.find((f) => f.hasUnreadLogs);
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
