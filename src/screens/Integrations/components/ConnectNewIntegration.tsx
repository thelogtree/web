import "../index.css";

import { Modal } from "antd";
import { integrationTypeEnum, keyTypeEnum } from "logtree-types";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Grid, Row } from "react-flexbox-grid";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { useFetchIntegrations } from "src/redux/actionIndex";
import {
  getConnectableIntegrations,
  getOrganization,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import BackArrowIcon from "src/assets/backArrow.png";
import LockIcon from "src/assets/grayLock.png";

import { keyTypePrettyNameMap } from "../lib";
import { IntegrationsToConnectToMap } from "../integrationsToConnectTo";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export type KeyInput = {
  type: keyTypeEnum;
  plaintextValue: string;
};

export const ConnectNewIntegration = ({
  isModalOpen,
  setIsModalOpen,
}: Props) => {
  const organization = useSelector(getOrganization);
  const [selectedIntegration, setSelectedIntegration] =
    useState<integrationTypeEnum | null>(null);
  const [keyInputs, setKeyInputs] = useState<KeyInput[]>([]);
  const connectableIntegrations = useSelector(getConnectableIntegrations);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch: refetchIntegrations } = useFetchIntegrations();

  const title = useMemo(() => {
    if (selectedIntegration) {
      return `Enter your ${keyInputs.length === 1 ? "key" : "keys"} for ${
        IntegrationsToConnectToMap[selectedIntegration].prettyName
      }`;
    } else if (connectableIntegrations.length) {
      return "Select an integration to connect to";
    }
    return "You have already connected to all of the available integrations.";
  }, [selectedIntegration, keyInputs.length, connectableIntegrations.length]);

  useEffect(() => {
    if (selectedIntegration) {
      setKeyInputs(
        IntegrationsToConnectToMap[selectedIntegration].keyTypesNeeded.map(
          (type) => ({
            type,
            plaintextValue: "",
          })
        )
      );
    } else {
      setKeyInputs([]);
    }
  }, [selectedIntegration]);

  const _cancel = () => {
    setIsModalOpen(false);
    setSelectedIntegration(null);
  };

  const _onSubmit = async () => {
    try {
      if (isLoading || !selectedIntegration) {
        return;
      }
      if (keyInputs.find((input) => !input.plaintextValue)) {
        throw new Error("Please fill in all the fields.");
      }
      setIsLoading(true);
      await Api.organization.addIntegration(
        organization!._id.toString(),
        keyInputs,
        selectedIntegration
      );
      await refetchIntegrations();
      setIsModalOpen(false);
      setSelectedIntegration(null);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _changeKeyInput = (value: string, index: number) => {
    const newArray: KeyInput[] = keyInputs.map((input, i) =>
      i === index ? { plaintextValue: value, type: input.type } : input
    );
    setKeyInputs(newArray);
  };

  return (
    <Modal
      open={isModalOpen}
      width={600}
      onCancel={_cancel}
      onOk={selectedIntegration ? _onSubmit : undefined}
      okText={isLoading ? "Connecting..." : "Connect"}
      okButtonProps={{
        hidden: !selectedIntegration,
        disabled: isLoading,
        loading: isLoading,
      }}
    >
      <div style={styles.container}>
        {!selectedIntegration || keyInputs.length ? ( // this conditional helps avoid a glitchy feel
          <>
            <label
              style={{
                ...styles.title,
                ...(selectedIntegration && { paddingBottom: 8 }),
              }}
            >
              {title}
            </label>
            {!selectedIntegration && !connectableIntegrations.length ? (
              <span style={styles.contactUsText}>
                <a href="mailto:hello@logtree.co" style={styles.contactUsLink}>
                  Contact us
                </a>{" "}
                to request a new integration.
              </span>
            ) : null}
            {selectedIntegration && (
              <button
                style={styles.chooseDifferentIntegrationBtn}
                onClick={() => setSelectedIntegration(null)}
              >
                <img src={BackArrowIcon} style={styles.backIcon} />
              </button>
            )}
            {selectedIntegration ? (
              <>
                <label style={styles.helpDescription}>
                  {
                    IntegrationsToConnectToMap[selectedIntegration]
                      .helpDescription
                  }
                </label>
                {keyInputs.map((keyInput, i) => (
                  <input
                    key={i}
                    style={styles.keyInput}
                    value={keyInput.plaintextValue}
                    onChange={(e) => _changeKeyInput(e.target.value, i)}
                    placeholder={keyTypePrettyNameMap[keyInput.type]}
                  />
                ))}
                <div style={styles.encryptionContainer}>
                  <img src={LockIcon} style={styles.icon} />
                  <label style={styles.encryptedMessage}>
                    This information will be securely encrypted.
                  </label>
                </div>
              </>
            ) : (
              <Grid style={styles.gridContainer}>
                <Row>
                  <Col xs={3}>
                    {connectableIntegrations.map((integrationKey) => {
                      const integration =
                        IntegrationsToConnectToMap[integrationKey];
                      return (
                        <button
                          style={styles.integrationBtn}
                          className="integrationToConnect"
                          onClick={() => setSelectedIntegration(integrationKey)}
                        >
                          <img
                            src={integration.image}
                            style={styles.integrationImg}
                          />
                          <label style={styles.integrationName}>
                            {integration.prettyName}
                          </label>
                        </button>
                      );
                    })}
                  </Col>
                </Row>
              </Grid>
            )}
          </>
        ) : null}
      </div>
    </Modal>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 30,
    minHeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
    paddingBottom: 20,
  },
  integrationBtn: {
    outline: "none",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
    height: 130,
    width: 130,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 15,
  },
  integrationImg: {
    maxWidth: 60,
    maxHeight: 60,
    cursor: "pointer",
  },
  integrationName: {
    fontSize: 18,
    fontWeight: 500,
    paddingTop: 10,
    cursor: "pointer",
  },
  gridContainer: {
    width: "100%",
  },
  keyInput: {
    outline: "none",
    border: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    width: "100%",
  },
  backIcon: {
    width: 35,
    height: 35,
    cursor: "pointer",
  },
  chooseDifferentIntegrationBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: Colors.transparent,
  },
  contactUsText: {
    fontSize: 16,
    color: Colors.darkerGray,
    paddingTop: 15,
    textAlign: "center",
  },
  contactUsLink: {
    textDecoration: "underline",
    fontWeight: 500,
    color: Colors.darkerGray,
  },
  encryptedMessage: {
    fontSize: 12,
    color: Colors.darkerGray,
    paddingLeft: 4,
  },
  helpDescription: {
    fontSize: 12,
    width: "85%",
    color: Colors.darkerGray,
    textAlign: "center",
    paddingBottom: 50,
  },
  encryptionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    width: 15,
    height: 15,
  },
};
