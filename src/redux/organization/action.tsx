import * as Sentry from "@sentry/react";
import { OrganizationDocument, UserDocument } from "logtree-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Api } from "../../api";
import { getOrganization, getUser } from "./selector";
import { getAuthStatus } from "../auth/selector";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";

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

// actions identifiable by the reducer
export type OrganizationActionsIndex =
  | ISetOrganization
  | ISetUser
  | ISetFolders
  | ISetOrganizationMembers
  | ISetFavoriteFolderPaths;

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
      setIsFetching(true);
      const res = await Api.organization.getOrganization(
        user.organizationId as string
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
