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
};

export const AcceptInviteForm = ({
  numMembers,
  organizationId,
  invitationId,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const joinTeamBtnText = useMemo(() => {
    return numMembers >= 1 ? "Join team" : "Become first member";
  }, [numMembers]);

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
    } catch (e) {
      showGenericErrorAlert(e);
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    backgroundColor: Colors.white,
    padding: 32,
    boxShadow: "0px 12px 10px rgba(0,0,0,0.1)",
  },
  input: {
    backgroundColor: Colors.veryLightGray,
    borderRadius: 4,
    outline: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    width: "100%",
    height: 35,
    paddingLeft: 8,
  },
  inputTitle: {
    paddingBottom: 10,
    fontWeight: 400,
  },
  joinTeamBtn: {
    outline: "none",
    borderRadius: 4,
    backgroundColor: Colors.blue800,
    border: "none",
    width: "100%",
    marginTop: 30,
    height: 40,
    color: Colors.white,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};
