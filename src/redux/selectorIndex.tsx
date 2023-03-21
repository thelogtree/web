import { AuthReducerType } from "./auth/reducer";
import { OrganizationReducerType } from "./organization/reducer";

export interface ReduxState {
  authReducer: AuthReducerType;
  organizationReducer: OrganizationReducerType;
}

export const getAuthReducer = (state: ReduxState) => state.authReducer;
export const getOrganizationReducer = (state: ReduxState) =>
  state.organizationReducer;
