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
  const joiningText = useMemo(
    () =>
      orgJoiningTextOnInviteScreen(
        invitationInfo?.organizationName,
        invitationInfo?.numMembers
      ),
    [invitationInfo?.organizationName, invitationInfo?.numMembers]
  );

  return shouldShowLoadingSpinner ? (
    <LoadingSpinnerFullScreen />
  ) : (
    <DynamicContainer innerStyle={{ paddingTop: "12%" }}>
      <label style={styles.joiningText}>{joiningText}</label>
      <AcceptInviteForm
        invitationId={invitationId}
        organizationId={invitationInfo.organizationId}
        numMembers={invitationInfo.numMembers}
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
    fontSize: 30,
    color: Colors.black,
    paddingBottom: 40,
    textAlign: "center",
    width: "100%",
    fontWeight: 300,
  },
};
