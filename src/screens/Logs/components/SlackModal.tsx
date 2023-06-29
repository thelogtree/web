import { Modal } from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import useClipboard from "react-use-clipboard";
import { Api } from "src/api";
import { Colors } from "src/utils/colors";
import { SharedStyles } from "src/utils/styles";
import AddToSlackIcon from "src/assets/addToSlack.png";

import { useFindFrontendFolderFromUrl } from "../lib";

type Props = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
};

export const SlackModal = ({ isModalVisible, setIsModalVisible }: Props) => {
  const folder = useFindFrontendFolderFromUrl();
  const [installationCode, setInstallationCode] = useState<string>("");
  const [isCopied, setIsCopied] = useClipboard(
    `/subscribe ${installationCode}`,
    { successDuration: 3000 }
  );
  const [installUrl, setInstallUrl] = useState<string | null>(null);

  useEffect(() => {
    if (folder && isModalVisible) {
      Api.organization
        .getSlackInstallUrl(folder?._id.toString()!)
        .then((res) => {
          const { installationUrl, installationCode: installationCodeTemp } =
            res.data;
          setInstallUrl(installationUrl);
          setInstallationCode(installationCodeTemp);
        });
    } else if (!isModalVisible) {
      setInstallationCode("");
      setInstallUrl("");
    }
  }, [folder?._id, isModalVisible]);

  if (!installUrl || !installationCode) {
    return null;
  }

  return (
    <Modal
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={900}
      cancelText="Close"
      okButtonProps={{ hidden: true }}
    >
      <div style={styles.container}>
        <div style={styles.contentContainer}>
          <label style={SharedStyles.modalSubheaderText}>
            Connecting Slack (takes 1 minute)
          </label>
          <br />
          <label style={SharedStyles.modalDescriptionText}>
            Our Slack integration will forward events from this Logtree channel
            to Slack. This may be useful if you don't check Logtree often but
            still want to be able to see certain Logtree events in Slack. To set
            this up in your Slack workspace, follow the instructions below.
          </label>
          <br />
          <br />
          <label style={SharedStyles.modalSubheaderText}>
            Install Logtree app to Slack workspace
          </label>
          <br />
          <label style={SharedStyles.modalDescriptionText}>
            First you'll need to add the Logtree App to your Slack workspace by
            clicking the "Add to Slack" button below. This will start the
            process for connecting your Slack workspace to Logtree. If your
            workspace is already connected to Logtree from a previous install,
            you can skip this step!
          </label>
          <br />
          <div style={styles.slackBtnWrap}>
            <a href={installUrl} target="_blank">
              <img
                alt="Add to Slack"
                height="50"
                width="180"
                src={AddToSlackIcon}
              />
            </a>
          </div>
          <br />
          <label style={SharedStyles.modalDescriptionText}>
            Once you've clicked the button above, you will be shown a
            permissions screen. This just gives us permission to send events in
            your Slack channel. Press allow to install the app in your Slack
            workspace.
          </label>
          <br />
          <label style={{ ...SharedStyles.modalSubheaderText, marginTop: 30 }}>
            Connecting your Slack channel to Logtree
          </label>
          <br />
          <label style={SharedStyles.modalDescriptionText}>
            Once you have the Logtree App installed on your Slack workspace,
            connecting a Logtree channel to a Slack channel is easy. Run the
            Slack command below in whichever channel you want to send these
            events to.
          </label>
          <div style={styles.codeBox}>
            <label style={{ fontSize: 16, margin: 0 }}>
              /subscribe {installationCode}
            </label>
            <button style={styles.copyBtn} onClick={setIsCopied}>
              <label style={styles.copyBtnText}>
                {isCopied ? "Copied!" : "Copy"}
              </label>
            </button>
          </div>
          <br />
          <label style={SharedStyles.modalDescriptionText}>
            Once completed, we'll start sending any Logtree events from this
            channel into the Slack channel you connected it to. Please note that
            Slack enforces a rate limit, so we cannot guarantee that every event
            is forwarded into Slack successfully.
          </label>
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,
  contentContainer: {
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 60,
    paddingTop: 40,
    textAlign: "left",
  } as CSSProperties,
  slackScreenCapContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 30,
  } as CSSProperties,
  slackScreenCap: {
    borderRadius: 10,
    width: "100%",
    maxWidth: 500,
  } as CSSProperties,
  slackBtnWrap: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
  } as CSSProperties,
  codeBox: {
    marginTop: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
    background: "#f6f6f6",
    borderRadius: 10,
  } as CSSProperties,
  copyBtn: {
    borderRadius: 10,
    padding: "5px 10px 5px 10px",
    cursor: "pointer",
    border: "none",
    outline: "none",
    backgroundColor: Colors.black,
  } as CSSProperties,
  copyBtnText: {
    fontSize: 12,
    fontWeight: 600,
    color: Colors.white,
    cursor: "pointer",
  } as CSSProperties,
};
