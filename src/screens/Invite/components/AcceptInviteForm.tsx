import firebase from "../../../firebaseConfig";
import React, { useMemo, useState } from "react";
import { Api } from "src/api";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";

type Props = {
  numMembers: number;
  organizationId: string;
  invitationId: string;
  organizationName: string;
};

export const AcceptInviteForm = ({
  numMembers,
  organizationId,
  invitationId,
  organizationName,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const joinTeamBtnText = useMemo(() => {
    return numMembers < 1 ? `Join ${organizationName} on Logtree` : `Save`;
  }, [numMembers, organizationName]);

  const _submitForm = async () => {
    try {
      if (!email || !password) {
        throw new Error("Please fill in all the details.");
      }
      setIsLoading(true);
      await Api.organization.acceptInvite(
        organizationId,
        invitationId,
        email,
        password
      );
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      showGenericErrorAlert({
        message:
          "That email is either invalid or already in use by another Logtree account.",
      });
      setIsLoading(false); // this must stay only in the catch
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.inputTitle}>Work email</label>
      <input
        placeholder="john@companyname.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <label style={{ ...styles.inputTitle, paddingTop: 24 }}>
        Set password
      </label>
      <input
        placeholder="Secret"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        style={styles.input}
        autoComplete="new-password"
      />
      <button
        style={{
          ...styles.joinTeamBtn,
          ...(isLoading && SharedStyles.loadingButton),
        }}
        onClick={_submitForm}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingSpinner
            size={16}
            color={Colors.white}
            style={{ marginRight: 12 }}
          />
        ) : null}
        {joinTeamBtnText}
      </button>
    </div>
  );
};

const styles: StylesType = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 32,
  },
  input: {
    backgroundColor: Colors.veryLightGray,
    borderRadius: 4,
    outline: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    width: "100%",
    height: 45,
    paddingLeft: 10,
  },
  inputTitle: {
    paddingBottom: 6,
    fontWeight: 400,
    color: Colors.darkerGray,
    fontSize: 13,
  },
  joinTeamBtn: {
    outline: "none",
    borderRadius: 30,
    backgroundColor: Colors.black,
    border: "none",
    width: "100%",
    marginTop: 20,
    height: 40,
    color: Colors.white,
    fontWeight: 400,
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};
