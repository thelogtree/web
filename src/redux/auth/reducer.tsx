import { AuthActionsIndex } from "./action";

export type AuthStatusType = "SIGNED_IN" | "NOT_SIGNED_IN" | "UNDETERMINED";

export type AuthReducerType = {
  authStatus: AuthStatusType;
};

const initialState: AuthReducerType = {
  authStatus: "UNDETERMINED",
};

export const authReducer = (
  state: AuthReducerType = initialState,
  action: AuthActionsIndex
): AuthReducerType => {
  switch (action.type) {
    case "SET_AUTH_STATUS":
      return {
        ...state,
        authStatus: action.authStatus,
      };
    default:
      return state;
  }
};
