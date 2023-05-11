import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Api } from "src/api";
import { getOrganization } from "src/redux/organization/selector";
import { DynamicContainer } from "src/sharedComponents/DynamicContainer";
import { showGenericErrorAlert, useSearchParams } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export const OAuthCallbackScreen = () => {
  const organization = useSelector(getOrganization);
  const { code, state } = useSearchParams();

  const _finishConnection = async () => {
    try {
      await Api.organization.finishOAuthConnection(
        organization!._id.toString(),
        state,
        code
      );
      window.open(`/org/${organization?.slug}/integrations`, "_self");
    } catch (e) {
      showGenericErrorAlert(e);
    }
  };

  useEffect(() => {
    if (organization) {
      _finishConnection();
    }
  }, [organization?._id]);

  return (
    <DynamicContainer innerStyle={{ paddingTop: "30%" }}>
      <label style={styles.title}>
        Please wait one moment while we finish connecting...
      </label>
    </DynamicContainer>
  );
};

const styles: StylesType = {
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
  },
};
