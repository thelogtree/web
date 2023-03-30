import React, { useEffect } from "react";
import firebase from "../../firebaseConfig";

export const SignOutScreen = () => {
  useEffect(() => {
    firebase.auth().signOut();
  }, []);

  return <label>Redirecting...</label>;
};
