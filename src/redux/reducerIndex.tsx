import { combineReducers } from "redux";

import { authReducer } from "./auth/reducer";
import { organizationReducer } from "./organization/reducer";

export const ReduxReducers = combineReducers({
  authReducer,
  organizationReducer,
});
