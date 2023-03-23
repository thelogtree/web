import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  setUser,
  useFetchMe,
  useFetchMyOrganization,
} from "src/redux/actionIndex";
import { getAuthStatus } from "src/redux/auth/selector";
import { getOrganization, getUser } from "src/redux/organization/selector";

import firebase from "../firebaseConfig";
import { setAuthStatus } from "../redux/auth/action";
import { analytics } from "../utils/segmentClient";
import { getFirstPathWithSlash, usePathname } from "./helpers";

// routes where logged out users can view it and will not be redirected anywhere
const NO_ACTION_ROUTES = ["/sign-in", "/invite"];

export const SetupApp = () => {
  const history = useHistory();
  const activePathname = usePathname();
  const { fetch: fetchUser } = useFetchMe();
  const { fetch: fetchMyOrganization } = useFetchMyOrganization();
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const authStatus = useSelector(getAuthStatus);
  const path = getFirstPathWithSlash(activePathname);

  useEffect(() => {
    if (user && authStatus === "SIGNED_IN") {
      if (user.organizationId.toString() === organization?._id) {
        history.push(`/org/${organization.slug}/dashboard`);
      } else {
        fetchMyOrganization();
      }
    } else if (
      !user &&
      authStatus === "NOT_SIGNED_IN" &&
      !NO_ACTION_ROUTES.includes(path)
    ) {
      history.push("/sign-in");
    }
  }, [user?._id, organization?.slug, authStatus]);

  useEffect(() => {
    if (authStatus === "SIGNED_IN") {
      fetchUser();
    }
  }, [authStatus, path]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        dispatch(setAuthStatus("SIGNED_IN"));
        analytics.identify(fbUser.uid, { email: fbUser.email });
      } else {
        dispatch(setUser(null));
        dispatch(setAuthStatus("NOT_SIGNED_IN"));
      }
    });
  }, []);

  return null;
};
