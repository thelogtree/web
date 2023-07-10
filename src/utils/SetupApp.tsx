import LogRocket from "logrocket";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFolders,
  setIntegrations,
  setOrganization,
  setUser,
  useFetchIntegrations,
  useFetchMe,
  useFetchMyOrganization,
} from "src/redux/actionIndex";
import { getAuthStatus } from "src/redux/auth/selector";
import {
  getIntegrations,
  getOrganization,
  getUser,
} from "src/redux/organization/selector";
import { ORG_ROUTE_PREFIX } from "src/RouteManager";

import firebase from "../firebaseConfig";
import { setAuthStatus } from "../redux/auth/action";
import { MySegment } from "../utils/segmentClient";
import { getFirstPathWithSlash, usePathname } from "./helpers";

// routes where logged out users can view it and will not be redirected anywhere
const NO_ACTION_ROUTES = [
  "/sign-in",
  "/invite",
  "/policies",
  "/learn",
  "/sign-up",
  "/",
  "/projects",
];

// routes where logged in users can view it and will not be redirected anywhere
const SIGNED_IN_ROUTES = ["/policies", "/oauth-callback", "/learn"];

export const SetupApp = () => {
  const activePathname = usePathname();
  const { fetch: fetchUser } = useFetchMe();
  const { fetch: fetchMyOrganization } = useFetchMyOrganization();
  const { fetch: fetchIntegrations, isFetching: isFetchingIntegrations } =
    useFetchIntegrations(true);
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const authStatus = useSelector(getAuthStatus);
  const path = getFirstPathWithSlash(activePathname);
  const integrations = useSelector(getIntegrations);

  useEffect(() => {
    if (user && authStatus === "SIGNED_IN") {
      fetchIntegrations();
    }
  }, [user?._id, authStatus]);

  useEffect(() => {
    if (user && authStatus === "SIGNED_IN" && !isFetchingIntegrations) {
      LogRocket.identify(user._id.toString(), {
        email: user.email,
      });
      if (
        organization &&
        (user.organizationId.toString() === organization?._id ||
          user.isAdmin) &&
        (path !== ORG_ROUTE_PREFIX ||
          !activePathname.includes(
            `${ORG_ROUTE_PREFIX}/${organization?.slug}`
          )) &&
        !SIGNED_IN_ROUTES.includes(path)
      ) {
        // navigateIfLost();
        if (integrations.length) {
          window.open(
            `${ORG_ROUTE_PREFIX}/${organization.slug}/journey`,
            "_self"
          );
        } else {
          window.open(
            `${ORG_ROUTE_PREFIX}/${organization.slug}/integrations`,
            "_self"
          );
        }
      } else {
        fetchMyOrganization();
      }
    } else if (
      !user &&
      authStatus === "NOT_SIGNED_IN" &&
      !NO_ACTION_ROUTES.includes(path)
    ) {
      window.open("/", "_self");
    }
  }, [user?._id, organization?.slug, authStatus, isFetchingIntegrations]);

  useEffect(() => {
    if (authStatus === "SIGNED_IN") {
      fetchUser();
    }
    console.log(document.referrer)
  }, [authStatus, path]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        dispatch(setAuthStatus("SIGNED_IN"));
        MySegment.identify(fbUser.uid, { email: fbUser.email });
      } else {
        dispatch(setUser(null));
        dispatch(setAuthStatus("NOT_SIGNED_IN"));
        dispatch(setFolders([]));
        dispatch(setOrganization(null));
        dispatch(setIntegrations([]));
      }
    });
  }, []);

  return null;
};
