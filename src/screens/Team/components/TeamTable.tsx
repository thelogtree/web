import React from "react";
import { useSelector } from "react-redux";
import { getOrganizationMembers } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";
import { MemberRow } from "./MemberRow";
import { Colors } from "src/utils/colors";

export const TeamTable = () => {
  const organizationMembers = useSelector(getOrganizationMembers);

  return (
    <div style={styles.container}>
      {organizationMembers.map((member, i) => (
        <MemberRow member={member} isFirst={!i} key={member._id.toString()} />
      ))}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex",
    width: "100%",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
  },
};
