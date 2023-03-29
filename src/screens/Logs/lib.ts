import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { Api } from "src/api";
import { getFolders, getOrganization } from "src/redux/organization/selector";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { showGenericErrorAlert, usePathname } from "src/utils/helpers";
import _ from "lodash";

export const useFindFrontendFolderFromUrl = () => {
  const organization = useSelector(getOrganization);
  const folders = useSelector(getFolders);
  const [lastFolderInPath, setLastFolderInPath] =
    useState<FrontendFolder | null>(null);
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
        setLastFolderInPath(currFolder);
        return;
      }
      foldersToTraverse = foldersToTraverse.concat(currFolder.children);
      foldersToTraverse = foldersToTraverse.slice(1);
    }
  };

  useEffect(() => {
    _dfsThroughFolders();
  }, [fullFolderPath, organization?._id, folders.length]);

  return lastFolderInPath;
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
};

const PAGINATION_RECORDS_INCREMENT = 100; // cannot be more than 100 because the backend only returns 100

export const useLogs = (folderId?: string) => {
  const organization = useSelector(getOrganization);
  const isFavoritesScreen = useIsFavoriteLogsScreen();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<FrontendLog[]>([]);
  const [numLogsInTotal, setNumLogsInTotal] = useState<number>(0);
  const [logsNoNewerThanDate, setLogsNoNewerThanDate] = useState<
    Date | undefined
  >(undefined);
  const [start, setStart] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [isSearchQueued, setIsSearchQueued] = useState<boolean>(false);

  const attemptFetchingMoreResults = async () => {
    setStart(Math.min(logs.length, start + PAGINATION_RECORDS_INCREMENT));
  };

  const _freshQueryAndReset = () => {
    setLogs([]);
    setStart(0);
    _fetchLogs(true); // override the "start" pagination index so we don't have to wait for react state to update
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
    _freshQueryAndReset();
  }, [folderId, organization?._id]);

  useEffect(() => {
    setIsSearchQueued(!!query);
    let typingTimer;
    if (query) {
      typingTimer = setTimeout(() => {
        _freshQueryAndReset();
      }, 600);
    } else {
      _freshQueryAndReset();
    }
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [query]);

  return {
    logs,
    numLogsInTotal,
    isLoading,
    attemptFetchingMoreResults,
    query,
    setQuery,
    isSearchQueued,
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
