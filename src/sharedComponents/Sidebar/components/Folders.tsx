import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getFolders, getOrganization } from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import { FolderOrChannel } from "./FolderOrChannel";
import { StylesType } from "src/utils/styles";
import { useFetchFolders } from "src/redux/actionIndex";

export type FrontendFolder = {
  children: FrontendFolder[];
  name: string;
  fullPath: string;
  _id: string;
};

export const Folders = () => {
  const organization = useSelector(getOrganization);
  const { fetch, isFetching } = useFetchFolders();
  const folders = useSelector(getFolders);

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  return isFetching ? null : (
    <div style={styles.container}>
      {folders.map((folder, i) => (
        <FolderOrChannel folderOrChannel={folder} index={i} />
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
};
