import { any, string } from "joi";
import { integrationTypeEnum, keyTypeEnum } from "logtree-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import SentryLogo from "src/assets/sentryLogo.png";
import {
  getIntegrations,
  getOrganization,
} from "src/redux/organization/selector";

type IntegrationMapValue = {
  image: any;
  prettyName: string;
  helpDescription: string;
  keyTypesNeeded: keyTypeEnum[];
};

export const IntegrationMap: {
  [key in integrationTypeEnum]: IntegrationMapValue;
} = {
  sentry: {
    image: SentryLogo,
    prettyName: "Sentry",
    helpDescription:
      "You can get an Auth Token in Sentry by going to User Settings > Auth Tokens > Create New Token.",
    keyTypesNeeded: [keyTypeEnum.AuthToken],
  },
};

// only shows the integrations that the organization has not yet connected to
export const useIntegrationMapKeysToConnectTo = () => {
  const organization = useSelector(getOrganization);
  const integrations = useSelector(getIntegrations);
  const integrationsToConnectTo = useMemo(() => {
    return Object.keys(IntegrationMap).filter(
      (someIntegrationType) =>
        !integrations.find(
          (integration) => integration.type === someIntegrationType
        )
    );
  }, [integrations.length]);

  if (!organization) {
    return [];
  }

  return integrationsToConnectTo as integrationTypeEnum[];
};

export const keyTypePrettyNameMap: { [key in keyTypeEnum]: string } = {
  auth_token: "Auth Token",
  api_key: "API Key",
  secret_key: "Secret Key",
};
