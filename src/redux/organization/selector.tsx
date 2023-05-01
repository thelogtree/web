import { createSelector } from "reselect";

import { getOrganizationReducer } from "../selectorIndex";
import { OrganizationReducerType } from "./reducer";

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

export const getOrganizationMembers = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.organizationMembers
);

export const getFavoriteFolderPaths = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.favoriteFolderPaths
);

export const getRules = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) => organizationReducer.rules
);

export const getSidebarWidth = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.sidebarWidth
);
