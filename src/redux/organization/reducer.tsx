import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { OrganizationActionsIndex } from "./action";
import {
  IntegrationDocument,
  OrganizationDocument,
  RuleDocument,
  UserDocument,
} from "logtree-types";
import { isMobile } from "react-device-detect";

export type OrganizationReducerType = {
  organization: OrganizationDocument | null;
  user: UserDocument | null;
  folders: FrontendFolder[];
  organizationMembers: UserDocument[];
  favoriteFolderPaths: string[];
  rules: RuleDocument[];
  sidebarWidth: number;
  integrations: IntegrationDocument[];
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
    default:
      return state;
  }
};
