import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFetchIntegrations } from "src/redux/actionIndex";
import {
  getIntegrations,
  getOrganization,
  getUser,
} from "src/redux/organization/selector";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { Colors } from "src/utils/colors";
import { SharedStyles, StylesType } from "src/utils/styles";
import { IntegrationRow } from "./components/IntegrationRow";
import { ConnectNewIntegration } from "./components/ConnectNewIntegration";
import { SUPPORT_TOOL_SUFFIX } from "src/RouteManager";
import AISupportScreenshot from "src/assets/aiLogtreeExample.png";
import { MyLogtree } from "src/utils/logtree";
import Swal from "sweetalert2";
import { SignedInOrganization } from "../SupportLogs/components/SignedInOrganization";
import { useTrackPageView } from "src/utils/useTrackPageView";

export const IntegrationsScreen = () => {
  useTrackPageView();
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const { fetch, isFetching } = useFetchIntegrations(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [requestedAccess, setRequestedAccess] = useState<boolean>(false);
  const integrations = useSelector(getIntegrations);
  const globalSearchPath = `/org/${organization?.slug}${SUPPORT_TOOL_SUFFIX}`;

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  const _requestGptAccess = async () => {
    await MyLogtree.sendLog({
      content: `User requested access to AI Support Engineer Bot:\n\nUser: ${user?.email}\nOrganization: ${organization?.slug}`,
      folderPath: "/ai-support-bot-access",
      referenceId: user?.email,
      additionalContext: {
        integrationsCount: integrations.length,
      },
    });
    Swal.fire({
      title: "Requested Access",
      text: `You've successfully requested access to the AI Support Engineer Bot! We'll email you soon with next steps.`,
      icon: "success",
    });
    setRequestedAccess(true);
  };

  return isFetching ? (
    <LoadingSpinnerFullScreen />
  ) : (
    <>
      <ConnectNewIntegration
        isModalOpen={isConnectModalOpen}
        setIsModalOpen={setIsConnectModalOpen}
      />
      <div style={styles.outerContainer}>
        <div style={styles.container}>
          <SignedInOrganization />
          <div style={styles.header}>
            <div style={styles.topLeft}>
              <label style={styles.title}>Manage integrations</label>
              {integrations.length ? (
                <label style={styles.desc}>
                  You can search for a user's activity from these integrations{" "}
                  <a
                    href={globalSearchPath}
                    style={styles.userActivityLink}
                    target="_self"
                  >
                    by clicking here.
                  </a>
                </label>
              ) : null}
            </div>
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
                  <IntegrationRow
                    key={integration._id.toString()}
                    integration={integration}
                    isFirst={!i}
                  />
                ))}
              </>
            ) : (
              <div style={styles.noIntegrationsYet}>
                <label style={styles.noConnectionsLbl}>
                  Connect integrations so you can easily search for a user's
                  activity across your entire app.
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
          {/* <div style={styles.gptAccess}>
          <div style={styles.gptLeftSide}>
            <label style={styles.gptTitle}>
              Deploy an AI Support Assistant 🪄
            </label>
            <label style={styles.gptDesc}>
              Our AI support bot looks through the events from your connected
              integrations and any Logtree events, then writes notes in Intercom
              conversations to help you resolve customer compliants 10x faster
              without having to interrupt your engineering team. The bot only
              provides notes when it has something useful to say, and it can
              only write notes to admins, so there's no risk of showing users
              responses that aren't helpful.
            </label>
            <label style={styles.gptDesc2}>
              If you want to look into the user's problem more after reading the
              note, we give you a link to view all a user's activity in your
              app.
            </label>
            <button
              style={{
                ...styles.getAccessBtn,
                ...(requestedAccess && SharedStyles.loadingButton),
              }}
              onClick={_requestGptAccess}
              disabled={requestedAccess}
            >
              Get access
            </button>
          </div>
          <img style={styles.aiExample} src={AISupportScreenshot} />
        </div> */}
        </div>
      </div>
    </>
  );
};

const styles: StylesType = {
  outerContainer: {
    width: "100%",
    paddingBottom: 60,
    paddingTop: 40,
    overflow: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "auto",
    width: "90%",
    maxWidth: 1200,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    paddingBottom: 25,
    paddingTop: 100,
  },
  table: {
    outline: "none",
    borderColor: Colors.lightGray,
    borderRadius: 8,
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
    backgroundColor: Colors.black,
    color: Colors.white,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  title: {
    fontWeight: 700,
    fontSize: 42,
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
  topLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  userActivityLink: {
    color: Colors.gray,
    fontWeight: 700,
  },
  desc: {
    color: Colors.gray,
    paddingTop: 16,
    fontSize: 14,
  },
  gptAccess: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    border: "none",
    width: "100%",
    marginTop: 90,
  },
  gptTitle: {
    fontSize: 18,
    fontWeight: 600,
    paddingBottom: 18,
  },
  gptDesc: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.gray,
    paddingBottom: 16,
    lineHeight: 1.4,
  },
  gptDesc2: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.gray,
    paddingBottom: 24,
    lineHeight: 1.4,
  },
  aiExample: {
    maxWidth: "50%",
    outline: "none",
    border: "none",
    maxHeight: 550,
  },
  getAccessBtn: {
    outline: "none",
    border: "none",
    borderRadius: 50,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    fontWeight: 600,
    color: Colors.white,
    cursor: "pointer",
    backgroundColor: Colors.black,
    fontSize: 15,
    boxShadow: "0px 2px 16px rgba(0,0,0,0.1)",
  },
  gptLeftSide: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "50%",
    paddingRight: 90,
  },
};
