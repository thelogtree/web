import SentryLogo from "src/assets/sentryLogo.png";
import { integrationTypeEnum, keyTypeEnum } from "logtree-types";

type IntegrationMapValue = {
  image: any;
  prettyName: string;
  helpDescription: string;
  keyTypesNeeded: keyTypeEnum[];
};

/*
this map is used to make the frontend more pretty and helpful for any integrations.
integrations shown here does not necessarily mean they will show up as connectable to the user.
this is because the backend filters these down more in the /connectable-integrations endpoint.

do not remove any integrations from this map until you have:
1. removed the ability to connect to that integration (backend task)
2. make sure no organizations are currently using the integration
*/
export const IntegrationsToConnectToMap: {
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
