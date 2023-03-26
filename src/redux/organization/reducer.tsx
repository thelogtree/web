import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { OrganizationActionsIndex } from "./action";
import { OrganizationDocument, UserDocument } from "logtree-types";

export type OrganizationReducerType = {
  organization: OrganizationDocument | null;
  user: UserDocument | null;
  folders: FrontendFolder[];
};

const initialState: OrganizationReducerType = {
  organization: null,
  user: null,
  folders: [],
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
    default:
      return state;
  }
};
