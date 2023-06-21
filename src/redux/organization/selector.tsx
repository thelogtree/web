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

export const getFunnels = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) => organizationReducer.funnels
);

export const getSidebarWidth = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.sidebarWidth
);

export const getIntegrations = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.integrations
);

export const getConnectableIntegrations = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.connectableIntegrations
);

export const getDashboards = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.dashboards
);

export const getWidgets = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) => organizationReducer.widgets
);

export const getCanAddWidget = createSelector(
  [getOrganizationReducer],
  (organizationReducer: OrganizationReducerType) =>
    organizationReducer.canAddWidget
);
