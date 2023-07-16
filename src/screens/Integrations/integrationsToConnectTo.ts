import SentryLogo from "src/assets/sentryLogo.png";
import MixpanelLogo from "src/assets/mixpanelLogo.png";
import IntercomLogo from "src/assets/intercomLogo.png";
import SendgridLogo from "src/assets/sendgridLogo.png";
import CustomerioLogo from "src/assets/customerioLogo.png";
import StripeLogo from "src/assets/stripeLogo.png";
import MongodbLogo from "src/assets/mongodbLogo.png";
import NewRelicLogo from "src/assets/newRelicLogo.png";
import { integrationTypeEnum, keyTypeEnum } from "logtree-types";
import { tabKeys } from "../SupportLogs/components/Tabs";

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
  showsLogsWhenThereIsNoQuery: boolean;
  whatThisDoesDescription: string;
  validTabKeys: tabKeys[];
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
    showsLogsWhenThereIsNoQuery: true,
    whatThisDoesDescription:
      "You'll be able to see a feed of recent events and also search for the recent errors of a specific user by their email address. Make sure you have setUser set up with Sentry in order for this to work correctly.",
    validTabKeys: [tabKeys.Timeline, tabKeys.Errors],
  },
  mixpanel: {
    image: MixpanelLogo,
    prettyName: "Mixpanel",
    helpDescription: `You must have either a paid Mixpanel account or applied for their 50k in free credits for startups program to use this integration. First, create a Service Account by going to Settings -> Organization Settings -> Service Accounts -> Add Service Account. Enter your Service Account's username and password below. Then go to Settings -> Organization Settings -> Projects -> click on the project you want to connect to -> enter the Project ID of that project below (the ID is a couple digits long).`,
    keyTypesNeeded: [keyTypeEnum.Username, keyTypeEnum.Password],
    additionalPropertiesNeeded: [
      { key: "projectId", prettyName: "Project ID" },
    ],
    isOAuth: false,
    showsLogsWhenThereIsNoQuery: false,
    whatThisDoesDescription:
      "You'll be able to search for the recent events of a specific user by their email address.",
    validTabKeys: [tabKeys.Timeline],
  },
  intercom: {
    image: IntercomLogo,
    prettyName: "Intercom",
    helpDescription: "",
    keyTypesNeeded: [],
    additionalPropertiesNeeded: [],
    isOAuth: true,
    showsLogsWhenThereIsNoQuery: true,
    whatThisDoesDescription:
      "You'll be able to see all recent Intercom messages and also search for the messages of a specific user by their email address.",
    validTabKeys: [tabKeys.Timeline, tabKeys.Support],
  },
  sendgrid: {
    image: SendgridLogo,
    prettyName: "Sendgrid",
    helpDescription:
      "This integration will only work if you have the Pro plan or higher in Sendgrid. You can get your API Key in Sendgrid by going to Settings > API Keys, and creating a new API Key or by entering your existing one below.",
    keyTypesNeeded: [keyTypeEnum.ApiKey],
    additionalPropertiesNeeded: [],
    isOAuth: false,
    showsLogsWhenThereIsNoQuery: false,
    whatThisDoesDescription:
      "You'll be able to see when emails are delivered successfully or unsuccessfully for a specific user when you search by their email address.",
    validTabKeys: [tabKeys.Timeline, tabKeys.Marketing],
  },
  customer_io: {
    image: CustomerioLogo,
    prettyName: "Customer.io",
    helpDescription:
      "You can get an API Key in Customer.io by going to Settings > Account Settings > API Credentials > App API Keys, and creating a new App API Key. You can get your workspace ID by looking at the URL when you are logged in to customer.io which will look something like fly.customer.io/journeys/env/YOUR_WORKSPACE_ID/dashboard. Please make sure the workspace you're in when you take this ID is the one you intend to fetch data for.",
    keyTypesNeeded: [keyTypeEnum.ApiKey],
    additionalPropertiesNeeded: [
      { key: "workspaceId", prettyName: "Workspace ID" },
    ],
    isOAuth: false,
    showsLogsWhenThereIsNoQuery: true,
    whatThisDoesDescription:
      "You'll be able to search for all message events (emails, push notifications) of a specific user by their email address.",
    validTabKeys: [tabKeys.Timeline, tabKeys.Marketing],
  },
  stripe: {
    image: StripeLogo,
    prettyName: "Stripe",
    helpDescription: `In the Stripe dashboard go to Developers > API Keys > Create restricted key > select the "Read" permission for both "Charges" and "Customers". This will make it so Logtree has read-only access to just this data. Enter the created restricted key below.`,
    keyTypesNeeded: [keyTypeEnum.ApiKey],
    additionalPropertiesNeeded: [],
    isOAuth: false,
    showsLogsWhenThereIsNoQuery: true,
    whatThisDoesDescription:
      "You'll be able to see all your recent payment events and also search for the payments of a specific user by their email address.",
    validTabKeys: [tabKeys.Timeline],
  },
  mongodb: {
    image: MongodbLogo,
    prettyName: "MongoDB",
    helpDescription: `Go to your project in the MongoDB dashboard. Click "Data API" on the sidebar. Navigate to the "API Keys" tab. Click "Create API Key". Enter a name for your key and generate it. Enter the created API key below. Feel free to also make your key Read Only access. Next, click on the "Data API" tab right next to the API Keys tab. Enter the "URL Endpoint" below. Enter your Data Source below. Next, navigate to your database > Collections > enter the name of your database below. So you know what to look for, common database names are "test", "prod", etc. Now, below you must enter the name of the collection that holds your users. Then, enter in the names of the properties that hold your user's email and ID. These are commonly "email" and "_id".`,
    keyTypesNeeded: [keyTypeEnum.ApiKey],
    additionalPropertiesNeeded: [
      { key: "baseUrl", prettyName: "Endpoint URL" },
      { key: "cluster", prettyName: "Data source" },
      { key: "database", prettyName: "Database (e.g. 'test', 'prod')" },
      { key: "collection", prettyName: "Collection name (e.g. 'users')" },
      {
        key: "emailKeyField",
        prettyName: "User email field name (e.g. 'email')",
      },
      { key: "idKeyField", prettyName: "User ID field name (e.g. '_id')" },
    ],
    isOAuth: false,
    showsLogsWhenThereIsNoQuery: false,
    whatThisDoesDescription:
      "By doing all of this, we will be able to know which user IDs belong to which user emails, which lets you pull events from more integrations that typically use the user ID as a query parameter like Datadog, NewRelic, and more.",
    validTabKeys: [tabKeys.Timeline],
  },
  new_relic: {
    image: NewRelicLogo,
    prettyName: "New Relic",
    helpDescription: `Go to your profile in New Relic and click on "API Keys". Click "Create a Key" and create a new API key with the key type "User". Enter that key below. Next, enter your key's Account ID below too. Then, enter below the name of the field you are logging that represents a user's user ID (e.g. 'userId').`,
    keyTypesNeeded: [keyTypeEnum.ApiKey],
    additionalPropertiesNeeded: [
      { key: "accountId", prettyName: "Account ID" },
      { key: "userIdField", prettyName: "User ID field (e.g. 'userId')" },
    ],
    isOAuth: false,
    showsLogsWhenThereIsNoQuery: false,
    whatThisDoesDescription:
      "We'll show you all of the logs that correspond with a specific user.",
    validTabKeys: [tabKeys.Requests],
  },
};
