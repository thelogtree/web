import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getOrganization,
  getOrganizationMembers,
} from "src/redux/organization/selector";
import { TeamTable } from "./components/TeamTable";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";
import { useFetchOrganizationMembers } from "src/redux/actionIndex";
import { StylesType } from "src/utils/styles";
import { GenerateInviteLinkButton } from "./components/GenerateInviteLinkButton";

export const TeamScreen = () => {
  const organization = useSelector(getOrganization);
  const organizationMembers = useSelector(getOrganizationMembers);
  const { fetch } = useFetchOrganizationMembers();

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  return organizationMembers.length ? (
    <div style={styles.container}>
      <div style={styles.topContainer}>
        <label style={styles.title}>{organization?.name} members</label>
        <GenerateInviteLinkButton />
      </div>
      <TeamTable />
    </div>
  ) : (
    <LoadingSpinnerFullScreen />
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    padding: 90,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 30,
    width: "100%",
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
  },
};
