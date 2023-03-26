import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { getFolders, getOrganization } from "src/redux/organization/selector";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { usePathname } from "src/utils/helpers";

export const useFindFrontendFolderFromUrl = () => {
  const organization = useSelector(getOrganization);
  const folders = useSelector(getFolders);
  const [lastFolderInPath, setLastFolderInPath] =
    useState<FrontendFolder | null>(null);
  const path = usePathname();
  const fullFolderPath = useMemo(() => {
    const whereFolderPathStarts =
      path.indexOf(LOGS_ROUTE_PREFIX) + LOGS_ROUTE_PREFIX.length;
    return path.substring(whereFolderPathStarts);
  }, [path]);

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
