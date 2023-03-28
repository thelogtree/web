import { orgPermissionLevel } from "logtree-types";
import React, { useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getOrganization, getUser } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";
import Swal from "sweetalert2";

export const GenerateKeys = () => {
  const user = useSelector(getUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plaintextSecretKey, setPlaintextSecretKey] = useState<string>("");
  const [justCopiedPublishableApiKey, setJustCopiedPublishableApiKey] =
    useState<boolean>(false);
  const [justCopiedPlaintextSecretKey, setJustCopiedPlaintextSecretKey] =
    useState<boolean>(false);
  const organization = useSelector(getOrganization);
  const alreadyGeneratedSecretKey = Boolean(
    organization?.keys.encryptedSecretKey
  );
  const isUserAnOrgAdmin =
    user?.orgPermissionLevel === orgPermissionLevel.Admin;

  const keyText = useMemo(() => {
    if (plaintextSecretKey) {
      return plaintextSecretKey;
    }
    return alreadyGeneratedSecretKey
      ? "Your team has already generated a secret key."
      : "To get started, generate your secret key by clicking the button below.";
  }, [alreadyGeneratedSecretKey, plaintextSecretKey]);

  const generateKeyButtonText = useMemo(() => {
    if (isLoading) {
      return "Generating...";
    }
    return alreadyGeneratedSecretKey
      ? "Regenerate secret key"
      : "Generate secret key";
  }, [alreadyGeneratedSecretKey, isLoading]);

  const _generateSecretKey = async () => {
    try {
      setIsLoading(true);
      const res = await Api.organization.generateSecretKey(
        organization!._id.toString()
      );
      const { plaintextSecretKey: tempPlaintextSecretKey } = res.data;
      setPlaintextSecretKey(tempPlaintextSecretKey);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _confirmGenerateSecretKey = async () => {
    if (!isUserAnOrgAdmin) {
      showGenericErrorAlert({
        message: "You must be an admin to generate a secret key.",
      });
      return;
    }
    if (!alreadyGeneratedSecretKey) {
      return _generateSecretKey();
    }
    const res = await Swal.fire({
      title: "Please confirm",
      text: "If you regenerate your secret key, any API requests that use your old secret key will immediately start failing.",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Regenerate",
      cancelButtonText: "Cancel",
    });
    if (res.isConfirmed) {
      return _generateSecretKey();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setJustCopiedPlaintextSecretKey(false);
    }, 2000);
  }, [justCopiedPlaintextSecretKey]);

  useEffect(() => {
    setTimeout(() => {
      setJustCopiedPublishableApiKey(false);
    }, 2000);
  }, [justCopiedPublishableApiKey]);

  return (
    <div style={styles.container}>
      <label style={styles.yourKeysSectionTitle}>YOUR API KEYS</label>
      <div style={styles.keyContainer}>
        <label style={styles.publishableApiKey}>
          Your publishable API key is{" "}
          <span style={styles.publishableApiKeyActualKeyText}>
            {organization?.keys.publishableApiKey}
          </span>
        </label>
        <CopyToClipboard
          text={organization!.keys.publishableApiKey}
          onCopy={() => setJustCopiedPublishableApiKey(true)}
        >
          <button style={styles.copyBtn}>
            {justCopiedPublishableApiKey ? "Copied!" : "Copy"}
          </button>
        </CopyToClipboard>
      </div>
      <hr style={styles.hr} />
      {plaintextSecretKey ? (
        <label style={styles.keepKeySafe}>
          Keep this key safe! It will disappear once you leave this page.
        </label>
      ) : null}
      <div style={styles.keyContainer}>
        <label
          style={{
            ...styles.keyText,
            ...(plaintextSecretKey && { fontWeight: 500 }),
          }}
        >
          {keyText}
        </label>
        {plaintextSecretKey ? (
          <CopyToClipboard
            text={plaintextSecretKey}
            onCopy={() => setJustCopiedPlaintextSecretKey(true)}
          >
            <button style={styles.copyBtn}>
              {justCopiedPlaintextSecretKey ? "Copied!" : "Copy"}
            </button>
          </CopyToClipboard>
        ) : null}
      </div>
      {plaintextSecretKey ? null : (
        <div style={styles.generateActionContainer}>
          <button
            style={{
              ...styles.generateSecretKey,
              ...(isLoading && SharedStyles.loadingButton),
              ...(!isUserAnOrgAdmin && { opacity: 0.3, cursor: "auto" }),
            }}
            onClick={_confirmGenerateSecretKey}
            disabled={isLoading || !isUserAnOrgAdmin}
          >
            {generateKeyButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 25,
    borderRadius: 8,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    position: "relative",
  },
  keyText: {
    fontSize: 16,
    fontWeight: 300,
  },
  keyContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  copyBtn: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginLeft: 14,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 13,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  generateSecretKey: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
    color: Colors.black,
    cursor: "pointer",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
  generateActionContainer: {
    paddingTop: 14,
  },
  keepKeySafe: {
    color: Colors.darkGray,
    paddingBottom: 12,
    fontSize: 13,
    fontWeight: 400,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    height: 1,
    border: "none",
    marginBottom: 24,
    marginTop: 20,
  },
  publishableApiKey: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: 300,
  },
  publishableApiKeyActualKeyText: {
    fontWeight: 500,
    color: Colors.black,
    marginLeft: 4,
  },
  yourKeysSectionTitle: {
    fontWeight: 300,
    backgroundColor: Colors.white,
    color: Colors.darkGray,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    position: "absolute",
    top: -15,
    left: 18,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    letterSpacing: 1,
  },
};
