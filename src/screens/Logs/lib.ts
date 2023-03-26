import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { Api } from "src/api";
import { getFolders, getOrganization } from "src/redux/organization/selector";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { showGenericErrorAlert, usePathname } from "src/utils/helpers";

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

export const useLogs = (folderId?: string) => {
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<FrontendLog[]>([]);

  const _fetchLogs = async () => {
    try {
      if (!organization || !folderId) {
        return null;
      }
      setIsLoading(true);
      const res = await Api.organization.getLogs(
        organization._id.toString(),
        folderId
      );
      const { logs: fetchedLogs } = res.data;
      setLogs(fetchedLogs);
      setIsLoading(false);
    } catch (e) {
      showGenericErrorAlert(e);
    }
  };

  useEffect(() => {
    _fetchLogs();
  }, [folderId, organization?._id]);

  return { logs, isLoading };
};
