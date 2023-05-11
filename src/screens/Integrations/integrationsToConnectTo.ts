import SentryLogo from "src/assets/sentryLogo.png";
import MixpanelLogo from "src/assets/mixpanelLogo.png";
import IntercomLogo from "src/assets/intercomLogo.png";
import { integrationTypeEnum, keyTypeEnum } from "logtree-types";

export type AdditionalPropertyObj = {
  key: string;
  prettyName: string;
};

type IntegrationMapValue = {
  image: any;
  prettyName: string;
  helpDescription: string;
  keyTypesNeeded: keyTypeEnum[];
  additionalPropertiesNeeded: AdditionalPropertyObj[];
  isOAuth: boolean;
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
    additionalPropertiesNeeded: [],
    isOAuth: false,
  },
  mixpanel: {
    image: MixpanelLogo,
    prettyName: "Mixpanel",
    helpDescription: `First, create a Service Account by going to Settings -> Organization Settings -> Service Accounts -> Add Service Account. Enter your Service Account's username and password below. Then go to Settings -> Organization Settings -> Projects -> click on the project you want to connect to -> enter the Project ID of that project below (the ID is a couple digits long).`,
    keyTypesNeeded: [keyTypeEnum.Username, keyTypeEnum.Password],
    additionalPropertiesNeeded: [
      { key: "projectId", prettyName: "Project ID" },
    ],
    isOAuth: false,
  },
  intercom: {
    image: IntercomLogo,
    prettyName: "Intercom",
    helpDescription: "",
    keyTypesNeeded: [],
    additionalPropertiesNeeded: [],
    isOAuth: true,
  },
};
