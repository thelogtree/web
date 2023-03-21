import * as Sentry from "@sentry/react";
import { OrganizationDocument, UserDocument } from "logtree-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Api } from "../../api";
import { getUser } from "./selector";

const SET_ORGANIZATION = "SET_ORGANIZATION";
type SET_ORGANIZATION = typeof SET_ORGANIZATION;
const SET_USER = "SET_USER";
type SET_USER = typeof SET_USER;

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

// actions identifiable by the reducer
export type OrganizationActionsIndex = ISetOrganization | ISetUser;

// api-related actions
export const useFetchMyOrganization = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async () => {
    let wasSuccessful = false;
    try {
      if (!user) {
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
