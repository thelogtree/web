import { OrganizationActionsIndex } from "./action";
import { OrganizationDocument, UserDocument } from "logtree-types";

export type OrganizationReducerType = {
  organization: OrganizationDocument | null;
  user: UserDocument | null;
};

const initialState: OrganizationReducerType = {
  organization: null,
  user: null,
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
    default:
      return state;
  }
};
