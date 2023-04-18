import { useDispatch, useSelector } from "react-redux";
import { getFolders } from "src/redux/organization/selector";
import { FrontendFolder } from "./components/Folders";
import { setFolders } from "src/redux/actionIndex";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useChildrenHasUnreadLogs } from "src/screens/Logs/lib";
import moment from "moment-timezone";

const _getShouldShowUpAsUnread = (
  childrenHasUnreadLogs: boolean,
  lastMarkedAsRead: Date | null
) =>
  childrenHasUnreadLogs &&
  (!lastMarkedAsRead || moment().diff(lastMarkedAsRead, "seconds") >= 2);

// this helps make a better ux instead of the user having to wait a few seconds
// for folders to refetch
export const useInstantlyMarkFolderAsRead = (
  folderOrChannel: FrontendFolder
) => {
  const [lastMarkedAsRead, setLastMarkedAsRead] = useState<Date | null>(null);
  const folders = useSelector(getFolders);
  const dispatch = useDispatch();
  const childrenIncludesUnreadChannel =
    useChildrenHasUnreadLogs(folderOrChannel);
  const [shouldShowUpAsUnread, setShouldShowUpAsUnread] = useState<boolean>(
    _getShouldShowUpAsUnread(childrenIncludesUnreadChannel, lastMarkedAsRead)
  );

  useEffect(() => {
    setShouldShowUpAsUnread(
      _getShouldShowUpAsUnread(childrenIncludesUnreadChannel, lastMarkedAsRead)
    );
    let interval = setInterval(() => {
      setShouldShowUpAsUnread(
        _getShouldShowUpAsUnread(
          childrenIncludesUnreadChannel,
          lastMarkedAsRead
        )
      );
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [folderOrChannel._id, childrenIncludesUnreadChannel, lastMarkedAsRead]);

  const _getUpdatedFolders = (folders: FrontendFolder[]) => {
    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];

      if (folder._id === folderOrChannel._id) {
        folder.hasUnreadLogs = false;
        return folders;
      }

      if (folder.children && folder.children.length > 0) {
        const updatedChildren = _getUpdatedFolders(folder.children);
        if (updatedChildren !== folder.children) {
          folder.children = updatedChildren;
          return folders;
        }
      }
    }

    return folders;
  };

  // problem rn is that we only update the top level folders. but we need to be able to update the children. maybe ask gpt?
  const markAsRead = () => {
    setLastMarkedAsRead(new Date());
    const copyOfFolders = folders.slice();
    const updatedFolders = _getUpdatedFolders(copyOfFolders);
    dispatch(setFolders(updatedFolders));
  };

  return { markAsRead, lastMarkedAsRead, shouldShowUpAsUnread };
};
