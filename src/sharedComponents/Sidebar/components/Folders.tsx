import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getFolders, getOrganization } from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import { FolderOrChannel } from "./FolderOrChannel";
import { StylesType } from "src/utils/styles";
import {
  useFetchFavoriteFolderPaths,
  useFetchFolders,
} from "src/redux/actionIndex";
import { Colors } from "src/utils/colors";
import { SyncButton } from "./SyncButton";

export type FrontendFolder = {
  children: FrontendFolder[];
  name: string;
  fullPath: string;
  hasUnreadLogs: boolean;
  _id: string;
};

export const Folders = () => {
  const organization = useSelector(getOrganization);
  const { fetch: fetchFolders, isFetching } = useFetchFolders();
  const { fetch: fetchFavoriteFolderPaths } = useFetchFavoriteFolderPaths();
  const folders = useSelector(getFolders);

  useEffect(() => {
    if (organization) {
      fetchFolders();
      fetchFavoriteFolderPaths();
    }
  }, [organization?._id]);

  return isFetching ? null : (
    <div style={styles.container}>
      {folders.length ? (
        <div style={styles.topContainer}>
          <label style={styles.title}>CHANNELS</label>
          <SyncButton />
        </div>
      ) : null}
      {folders.map((folder, i) => (
        <FolderOrChannel
          folderOrChannel={folder}
          hasTopBorder={!i}
          key={folder._id}
        />
      ))}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 50,
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
