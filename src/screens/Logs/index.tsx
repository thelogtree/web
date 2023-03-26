import React from "react";
import { StylesType } from "src/utils/styles";

import { Log } from "./components/Log";
import { useFindFrontendFolderFromUrl, useLogs } from "./lib";

export const LogsScreen = () => {
  const frontendFolder = useFindFrontendFolderFromUrl();
  const { logs, isLoading } = useLogs(frontendFolder?._id);

  return frontendFolder ? (
    <div style={styles.container}>
      <label style={styles.folderName}>{frontendFolder.name}</label>
      {logs.map((log) => (
        <Log log={log} />
      ))}
    </div>
  ) : null;
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 60,
  },
  folderName: {
    fontWeight: 600,
    fontSize: 30,
    paddingTop: 40,
    textAlign: "left",
    width: "100%",
    paddingBottom: 30,
  },
};
