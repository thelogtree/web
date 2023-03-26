import { LogDocument } from "logtree-types";
import React, { useState } from "react";
import { FrontendLog } from "./components/Log";
import { StylesType } from "src/utils/styles";
import { useFindFrontendFolderFromUrl } from "./lib";

export const LogsScreen = () => {
  const frontendFolder = useFindFrontendFolderFromUrl();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<FrontendLog[]>([]);

  return frontendFolder ? (
    <div style={styles.container}>
      <label style={styles.folderName}>{frontendFolder.name}</label>
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
  },
};
