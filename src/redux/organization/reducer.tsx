import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { OrganizationActionsIndex } from "./action";
import {
  DashboardDocument,
  FunnelDocument,
  IntegrationDocument,
  OrganizationDocument,
  RuleDocument,
  UserDocument,
  WidgetDocument,
  integrationTypeEnum,
} from "logtree-types";
import { isMobile } from "react-device-detect";

export type FrontendWidget = {
  widget: WidgetDocument;
  data: any;
};

export type OrganizationReducerType = {
  organization: OrganizationDocument | null;
  user: UserDocument | null;
  folders: FrontendFolder[];
  organizationMembers: UserDocument[];
  favoriteFolderPaths: string[];
  rules: RuleDocument[];
  sidebarWidth: number;
  integrations: IntegrationDocument[];
  connectableIntegrations: integrationTypeEnum[];
  funnels: FunnelDocument[];
  dashboards: DashboardDocument[];
  widgets: FrontendWidget[];
  canAddWidget: boolean;
};

const initialState: OrganizationReducerType = {
  organization: null,
  user: null,
  folders: [],
  organizationMembers: [],
  favoriteFolderPaths: [],
  rules: [],
  sidebarWidth: isMobile ? 0 : 240,
  integrations: [],
  connectableIntegrations: [],
  funnels: [],
  dashboards: [],
  widgets: [],
  canAddWidget: false,
};

export const organizationReducer = (
  state: OrganizationReducerType = initialState,
  action: OrganizationActionsIndex
): OrganizationReducerType => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_ORGANIZATION":
      return { ...state, organization: action.organization };
    case "SET_FOLDERS":
      return { ...state, folders: action.folders };
    case "SET_ORGANIZATION_MEMBERS":
      return { ...state, organizationMembers: action.organizationMembers };
    case "SET_FAVORITE_FOLDER_PATHS":
      return { ...state, favoriteFolderPaths: action.favoriteFolderPaths };
    case "SET_RULES":
      return { ...state, rules: action.rules };
    case "SET_SIDEBAR_WIDTH":
      return { ...state, sidebarWidth: action.sidebarWidth };
    case "SET_INTEGRATIONS":
      return { ...state, integrations: action.integrations };
    case "SET_CONNECTABLE_INTEGRATIONS":
      return { ...state, connectableIntegrations: action.integrationTypes };
    case "SET_FUNNELS":
      return { ...state, funnels: action.funnels };
    case "SET_WIDGETS":
      return { ...state, widgets: action.widgets };
    case "SET_DASHBOARDS":
      return { ...state, dashboards: action.dashboards };
    case "SET_CAN_ADD_WIDGET":
      return { ...state, canAddWidget: action.canAddWidget };
    default:
      return state;
  }
};
