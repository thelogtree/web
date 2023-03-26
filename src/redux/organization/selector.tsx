import { createSelector } from "reselect";

import { getOrganizationReducer } from "../selectorIndex";
import { organizationReducer, OrganizationReducerType } from "./reducer";

export const getOrganization = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.organization
);

export const getUser = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) => organizationReducer.user
);

export const getFolders = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) => organizationReducer.folders
);
