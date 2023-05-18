import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useFetchFavoriteFolderPaths,
  useFetchFolders,
  useFetchIntegrations,
  useFetchMyRules,
} from "src/redux/actionIndex";
import {
  getFolders,
  getIntegrations,
  getOrganization,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { FolderOrChannel } from "./FolderOrChannel";
import _ from "lodash";
import { ConnectionChannel } from "./ConnectionChannel";

export type FrontendFolder = {
  children: FrontendFolder[];
  name: string;
  fullPath: string;
  hasUnreadLogs: boolean;
  isMuted: boolean;
  description?: string;
  _id: string;
};

export const Connections = () => {
  const organization = useSelector(getOrganization);
  const { fetch: fetchMyIntegrations } = useFetchIntegrations();
  const integrations = useSelector(getIntegrations);

  useEffect(() => {
    if (organization) {
      fetchMyIntegrations();
    }
  }, [organization?._id]);

  return integrations.length ? (
    <div style={styles.container}>
      {integrations.length ? (
        <div style={styles.topContainer}>
          <label style={styles.title}>CONNECTIONS</label>
        </div>
      ) : null}
      {integrations.map((integration, i) => (
        <ConnectionChannel
          integrationType={integration.type}
          hasTopBorder={!i}
          key={integration._id.toString()}
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
    paddingBottom: 25,
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
