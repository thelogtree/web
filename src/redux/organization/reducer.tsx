import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { OrganizationActionsIndex } from "./action";
import { OrganizationDocument, UserDocument } from "logtree-types";

export type OrganizationReducerType = {
  organization: OrganizationDocument | null;
  user: UserDocument | null;
  folders: FrontendFolder[];
  organizationMembers: UserDocument[];
};

const initialState: OrganizationReducerType = {
  organization: null,
  user: null,
  folders: [],
  organizationMembers: [],
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
    default:
      return state;
  }
};
