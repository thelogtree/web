import * as Sentry from "@sentry/react";
import {
  DashboardDocument,
  FunnelDocument,
  IntegrationDocument,
  OrganizationDocument,
  RuleDocument,
  UserDocument,
  WidgetDocument,
  integrationTypeEnum,
} from "logtree-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Api } from "../../api";
import { getOrganization, getUser, getWidgets } from "./selector";
import { getAuthStatus } from "../auth/selector";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { IntegrationsToConnectToMap } from "src/screens/Integrations/integrationsToConnectTo";
import { Constants } from "src/utils/constants";
import { useCurrentDashboard } from "src/screens/Dashboard/lib";
import { FrontendWidget } from "./reducer";

const SET_SIDEBAR_WIDTH = "SET_SIDEBAR_WIDTH";
type SET_SIDEBAR_WIDTH = typeof SET_SIDEBAR_WIDTH;
const SET_ORGANIZATION = "SET_ORGANIZATION";
type SET_ORGANIZATION = typeof SET_ORGANIZATION;
const SET_USER = "SET_USER";
type SET_USER = typeof SET_USER;
const SET_FOLDERS = "SET_FOLDERS";
type SET_FOLDERS = typeof SET_FOLDERS;
const SET_ORGANIZATION_MEMBERS = "SET_ORGANIZATION_MEMBERS";
type SET_ORGANIZATION_MEMBERS = typeof SET_ORGANIZATION_MEMBERS;
const SET_FAVORITE_FOLDER_PATHS = "SET_FAVORITE_FOLDER_PATHS";
type SET_FAVORITE_FOLDER_PATHS = typeof SET_FAVORITE_FOLDER_PATHS;
const SET_RULES = "SET_RULES";
type SET_RULES = typeof SET_RULES;
const SET_INTEGRATIONS = "SET_INTEGRATIONS";
type SET_INTEGRATIONS = typeof SET_INTEGRATIONS;
const SET_CONNECTABLE_INTEGRATIONS = "SET_CONNECTABLE_INTEGRATIONS";
type SET_CONNECTABLE_INTEGRATIONS = typeof SET_CONNECTABLE_INTEGRATIONS;
const SET_FUNNELS = "SET_FUNNELS";
type SET_FUNNELS = typeof SET_FUNNELS;
const SET_DASHBOARDS = "SET_DASHBOARDS";
type SET_DASHBOARDS = typeof SET_DASHBOARDS;
const SET_WIDGETS = "SET_WIDGETS";
type SET_WIDGETS = typeof SET_WIDGETS;
const SET_CAN_ADD_WIDGET = "SET_CAN_ADD_WIDGET";
type SET_CAN_ADD_WIDGET = typeof SET_CAN_ADD_WIDGET;

type ISetSidebarWidth = {
  type: SET_SIDEBAR_WIDTH;
  sidebarWidth: number;
};
export const setSidebarWidth = (sidebarWidth: number): ISetSidebarWidth => ({
  type: SET_SIDEBAR_WIDTH,
  sidebarWidth,
});

type ISetOrganization = {
  type: SET_ORGANIZATION;
  organization: OrganizationDocument | null;
};
export const setOrganization = (
  organization: OrganizationDocument | null
): ISetOrganization => ({
  type: SET_ORGANIZATION,
  organization,
});

type ISetUser = {
  type: SET_USER;
  user: UserDocument | null;
};
export const setUser = (user: UserDocument | null): ISetUser => ({
  type: SET_USER,
  user,
});

type ISetFolders = {
  type: SET_FOLDERS;
  folders: FrontendFolder[];
};
export const setFolders = (folders: FrontendFolder[]): ISetFolders => ({
  type: SET_FOLDERS,
  folders,
});

type ISetOrganizationMembers = {
  type: SET_ORGANIZATION_MEMBERS;
  organizationMembers: UserDocument[];
};
export const setOrganizationMembers = (
  organizationMembers: UserDocument[]
): ISetOrganizationMembers => ({
  type: SET_ORGANIZATION_MEMBERS,
  organizationMembers,
});

type ISetFavoriteFolderPaths = {
  type: SET_FAVORITE_FOLDER_PATHS;
  favoriteFolderPaths: string[];
};
export const setFavoriteFolderPaths = (
  favoriteFolderPaths: string[]
): ISetFavoriteFolderPaths => ({
  type: SET_FAVORITE_FOLDER_PATHS,
  favoriteFolderPaths,
});

type ISetRules = {
  type: SET_RULES;
  rules: RuleDocument[];
};
export const setRules = (rules: RuleDocument[]): ISetRules => ({
  type: SET_RULES,
  rules,
});

type ISetIntegrations = {
  type: SET_INTEGRATIONS;
  integrations: IntegrationDocument[];
};
export const setIntegrations = (
  integrations: IntegrationDocument[]
): ISetIntegrations => ({
  type: SET_INTEGRATIONS,
  integrations,
});

type ISetConnectableIntegrations = {
  type: SET_CONNECTABLE_INTEGRATIONS;
  integrationTypes: integrationTypeEnum[];
};
export const setConnectableIntegrations = (
  integrationTypes: integrationTypeEnum[]
): ISetConnectableIntegrations => ({
  type: SET_CONNECTABLE_INTEGRATIONS,
  integrationTypes,
});

type ISetFunnels = {
  type: SET_FUNNELS;
  funnels: FunnelDocument[];
};
export const setFunnels = (funnels: FunnelDocument[]): ISetFunnels => ({
  type: SET_FUNNELS,
  funnels,
});

type ISetDashboards = {
  type: SET_DASHBOARDS;
  dashboards: DashboardDocument[];
};
export const setDashboards = (
  dashboards: DashboardDocument[]
): ISetDashboards => ({
  type: SET_DASHBOARDS,
  dashboards,
});

type ISetWidgets = {
  type: SET_WIDGETS;
  widgets: FrontendWidget[];
};
export const setWidgets = (widgets: FrontendWidget[]): ISetWidgets => ({
  type: SET_WIDGETS,
  widgets,
});

type ISetCanAddWidget = {
  type: SET_CAN_ADD_WIDGET;
  canAddWidget: boolean;
};
export const setCanAddWidget = (canAddWidget: boolean): ISetCanAddWidget => ({
  type: SET_CAN_ADD_WIDGET,
  canAddWidget,
});

// actions identifiable by the reducer
export type OrganizationActionsIndex =
  | ISetOrganization
  | ISetUser
  | ISetFolders
  | ISetOrganizationMembers
  | ISetFavoriteFolderPaths
  | ISetRules
  | ISetSidebarWidth
  | ISetIntegrations
  | ISetConnectableIntegrations
  | ISetFunnels
  | ISetDashboards
  | ISetWidgets
  | ISetCanAddWidget;

// api-related actions
export const useFetchMyOrganization = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const authStatus = useSelector(getAuthStatus);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      if (!user || authStatus !== "SIGNED_IN") {
        return;
      }
      const shouldUseOrgPathInstead =
        user.isAdmin && Constants.overrideOrgIdForAdmins;
      setIsFetching(true);
      const res = await Api.organization.getOrganization(
        shouldUseOrgPathInstead
          ? Constants.overrideOrgIdForAdmins
          : (user.organizationId as string)
      );
      const organization = res.data;
      dispatch(setOrganization(organization));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setOrganization(null));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchMe = () => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getMe();
      const user = res.data;
      dispatch(setUser(user));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setUser(null));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchFolders = () => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getFolders(
        organization!._id.toString()
      );
      const { folders: fetchedFolders } = res.data;
      dispatch(setFolders(fetchedFolders));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setFolders([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchOrganizationMembers = () => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getOrganizationMembers(
        organization!._id.toString()
      );
      const { users } = res.data;
      dispatch(setOrganizationMembers(users));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setOrganizationMembers([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchFunnels = (overrideInitialLoadingStateTo?: boolean) => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(
    overrideInitialLoadingStateTo || false
  );

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getFunnels(
        organization!._id.toString()
      );
      const { funnels } = res.data;
      dispatch(setFunnels(funnels));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setFunnels([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchFavoriteFolderPaths = () => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getFavoriteFolderPaths(
        organization!._id.toString()
      );
      const { folderPaths } = res.data;
      dispatch(setFavoriteFolderPaths(folderPaths));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setFavoriteFolderPaths([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchMyRules = () => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getRules(organization!._id.toString());
      const { rules } = res.data;
      dispatch(setRules(rules));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setRules([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchIntegrations = (
  overrideInitialLoadingStateTo?: boolean
) => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(
    overrideInitialLoadingStateTo || false
  );

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getIntegrations(
        organization!._id.toString()
      );
      const resConnectable = await Api.organization.getConnectableIntegrations(
        organization!._id.toString()
      );
      const { integrations } = res.data;
      const { integrations: connectableIntegrations } = resConnectable.data;
      dispatch(setIntegrations(integrations));
      const integrationsAlsoSupportedOnFrontend = Object.keys(
        IntegrationsToConnectToMap
      ).filter((type) =>
        connectableIntegrations.includes(type)
      ) as integrationTypeEnum[];
      dispatch(setConnectableIntegrations(integrationsAlsoSupportedOnFrontend));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setIntegrations([]));
      setConnectableIntegrations([]);
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchDashboards = () => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      setIsFetching(true);
      const res = await Api.organization.getDashboards(
        organization!._id.toString()
      );
      const { dashboards } = res.data;
      dispatch(setDashboards(dashboards));
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setDashboards([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  return { fetch, isFetching };
};

export const useFetchWidgetsWithData = (overrideInitialIsLoading?: boolean) => {
  const dispatch = useDispatch();
  const organization = useSelector(getOrganization);
  const currentDashboard = useCurrentDashboard();
  const widgets = useSelector(getWidgets);
  const [isFetchingWidgetData, setIsFetchingWidgetData] =
    useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(
    overrideInitialIsLoading || false
  );
  const widgetIds = widgets.map((w) => w.widget._id);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      if (!currentDashboard) {
        return;
      }
      setIsFetching(true);
      const res = await Api.organization.getWidgets(
        organization!._id.toString(),
        currentDashboard!._id.toString()
      );
      const { widgets } = res.data;
      dispatch(
        setWidgets(
          widgets.map((w) => ({
            widget: w,
            data: null,
          }))
        )
      );
      wasSuccessful = true;
    } catch (e) {
      Sentry.captureException(e);
      dispatch(setWidgets([]));
    }
    setIsFetching(false);
    return wasSuccessful;
  };

  const _fetchDataForWidgets = async () => {
    if (isFetchingWidgetData) {
      return;
    }
    setIsFetchingWidgetData(true);
    const hydratedWidgets = await Promise.all(
      widgets.map(async (w) => {
        const { widget } = w;
        try {
          const res = await Api.organization.loadWidget(
            organization!._id.toString(),
            widget!._id.toString()
          );
          const data = res.data.data ?? null;
          return { widget, data };
        } catch (e) {
          console.error(e);
          return w;
        }
      })
    );
    setWidgets(hydratedWidgets);
    setIsFetchingWidgetData(false);
  };

  useEffect(() => {
    if (widgetIds.length) {
      _fetchDataForWidgets();
    }
  }, [JSON.stringify(widgetIds)]);

  return { fetch, isFetching };
};
