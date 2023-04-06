import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useFetchFavoriteFolderPaths,
  useFetchFolders,
} from "src/redux/actionIndex";
import { getFolders, getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { FolderOrChannel } from "./FolderOrChannel";
import _ from "lodash";

export type FrontendFolder = {
  children: FrontendFolder[];
  name: string;
  fullPath: string;
  hasUnreadLogs: boolean;
  isMuted: boolean;
  description?: string;
  _id: string;
};

export const Folders = () => {
  const organization = useSelector(getOrganization);
  const { fetch: fetchFolders } = useFetchFolders();
  const { fetch: fetchFavoriteFolderPaths } = useFetchFavoriteFolderPaths();
  const folders = useSelector(getFolders);
  const sortedFolders = _.sortBy(folders, "isMuted");

  useEffect(() => {
    let fetchingInterval;
    if (organization) {
      fetchFolders();
      fetchFavoriteFolderPaths();
    }
    fetchingInterval = setInterval(() => {
      fetchFolders();
    }, 5000);
    return () => {
      if (fetchingInterval) {
        clearInterval(fetchingInterval);
      }
    };
  }, [organization?._id]);

  return folders.length ? (
    <div style={styles.container}>
      {folders.length ? (
        <div style={styles.topContainer}>
          <label style={styles.title}>CHANNELS</label>
        </div>
      ) : null}
      {sortedFolders.map((folder, i) => (
        <FolderOrChannel
          folderOrChannel={folder}
          hasTopBorder={!i}
          key={folder._id}
          isMutedBecauseOfParent={false}
        />
      ))}
    </div>
  ) : null;
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 80,
  },
  title: {
    color: Colors.darkGray,
    letterSpacing: 0.7,
    paddingLeft: 13,
    fontSize: 11,
    paddingRight: 0,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 8,
  },
};
