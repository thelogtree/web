import React, { useEffect, useMemo, useState } from "react";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";

import { orgJoiningTextOnInviteScreen, useInvitationInfo } from "./lib";
import { Colors } from "src/utils/colors";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { AcceptInviteForm } from "./components/AcceptInviteForm";
import { useParams } from "react-router-dom";

export const InviteScreen = () => {
  const { invitationInfo, isFetchingInvitationInfo } = useInvitationInfo();
  const params = useParams() as any;
  const invitationId = params["id"];
  const shouldShowLoadingSpinner = isFetchingInvitationInfo || !invitationInfo;

  return shouldShowLoadingSpinner ? (
    <LoadingSpinnerFullScreen />
  ) : (
    <DynamicContainer innerStyle={{ paddingTop: "12%" }}>
      <label style={styles.joiningText}>Finish creating your account</label>
      <label style={styles.joiningTextDesc}>
        Enter what you want your account's email and password to be.
      </label>
      <AcceptInviteForm
        invitationId={invitationId}
        organizationId={invitationInfo.organizationId}
        numMembers={invitationInfo.numMembers}
        organizationName={invitationInfo?.organizationName}
      />
    </DynamicContainer>
  );
};

const styles: StylesType = {
  container: {
    width: "90%",
    height: "100%",
  },
  joiningText: {
    fontSize: 26,
    color: Colors.black,
    textAlign: "center",
    width: "100%",
    fontWeight: 500,
  },
  joiningTextDesc: {
    fontSize: 15,
    color: Colors.darkerGray,
    paddingTop: 10,
    paddingBottom: 30,
    textAlign: "center",
    width: "100%",
    fontWeight: 300,
  },
};
