import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFetchIntegrations } from "src/redux/actionIndex";
import {
  getIntegrations,
  getOrganization,
} from "src/redux/organization/selector";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { IntegrationRow } from "./components/IntegrationRow";
import { ConnectNewIntegration } from "./components/ConnectNewIntegration";

export const IntegrationsScreen = () => {
  const organization = useSelector(getOrganization);
  const { fetch, isFetching } = useFetchIntegrations(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const integrations = useSelector(getIntegrations);

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  return isFetching ? (
    <LoadingSpinnerFullScreen />
  ) : (
    <>
      <ConnectNewIntegration
        isModalOpen={isConnectModalOpen}
        setIsModalOpen={setIsConnectModalOpen}
      />
      <div style={styles.container}>
        <div style={styles.header}>
          <label style={styles.title}>Connections</label>
          {integrations.length ? (
            <button
              style={styles.connectBtn}
              onClick={() => setIsConnectModalOpen(true)}
            >
              Connect more
            </button>
          ) : null}
        </div>
        <div style={styles.table}>
          {integrations.length ? (
            <>
              {integrations.map((integration, i) => (
                <IntegrationRow integration={integration} isFirst={!i} />
              ))}
            </>
          ) : (
            <div style={styles.noIntegrationsYet}>
              <label style={styles.noConnectionsLbl}>
                Connect integrations so you can easily view a user's activity in
                other apps.
              </label>
              <button
                style={styles.fallbackConnectIntegrationBtn}
                onClick={() => setIsConnectModalOpen(true)}
              >
                Connect integration
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    padding: 90,
    overflowY: "scroll",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  table: {
    outline: "none",
    borderColor: Colors.lightGray,
    borderRadius: 8,
    overflow: "hidden",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  noIntegrationsYet: {
    paddingTop: 50,
    paddingBottom: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "75%",
  },
  noConnectionsLbl: {
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: 400,
    paddingBottom: 18,
  },
  fallbackConnectIntegrationBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.lightGray,
    color: Colors.darkGray,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    cursor: "pointer",
    fontWeight: 400,
    fontSize: 14,
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
  },
  connectBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.white,
    color: Colors.black,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    cursor: "pointer",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.black,
    fontWeight: 500,
    fontSize: 14,
  },
};
