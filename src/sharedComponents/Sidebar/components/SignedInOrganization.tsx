import { Dropdown, MenuProps } from "antd";
import firebase from "firebase";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CaretDownIcon from "src/assets/caretDown.png";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { shortenString } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export const SignedInOrganization = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const organization = useSelector(getOrganization);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <label style={styles.signOutBtn}>Sign out</label>,
      onClick: () => firebase.auth().signOut(),
    },
  ];

  return organization ? (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div
        style={{
          ...styles.container,
          ...(isHovering && { backgroundColor: Colors.lightGray }),
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div style={styles.topHorizontal}>
          <label style={styles.orgName}>
            {shortenString(organization?.name, 23)}
          </label>
          <img src={CaretDownIcon} style={styles.caretDownIcon} />
        </div>
      </div>
    </Dropdown>
  ) : null;
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.veryLightGray,
    // width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    marginLeft: 12,
    marginTop: 20,
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    marginBottom: 10,
    // borderBottomColor: Colors.lightGray,
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    // paddingTop: 25,
    // paddingBottom: 25,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  topHorizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  orgName: {
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  caretDownIcon: {
    width: 8,
    height: 6,
    marginLeft: 10,
  },
  signOutBtn: {
    cursor: "pointer",
    color: Colors.red,
  },
  generateInviteLink: {
    cursor: "pointer",
  },
};
