import React, { useEffect, useMemo, useState } from "react";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { StylesType } from "src/utils/styles";

import { orgJoiningTextOnInviteScreen, useInvitationInfo } from "./lib";
import { Colors } from "src/utils/colors";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { AcceptInviteForm } from "./components/AcceptInviteForm";

export const InviteScreen = () => {
  const { invitationInfo, isFetchingInvitationInfo } = useInvitationInfo();
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
    <DynamicContainer innerStyle={{ paddingTop: "25%" }}>
      <label style={styles.joiningText}>{joiningText}</label>
      <AcceptInviteForm />
    </DynamicContainer>
  );
};

const styles: StylesType = {
  container: {
    width: "90%",
    height: "100%",
  },
  joiningText: {
    fontSize: 20,
    color: Colors.black,
  },
};
