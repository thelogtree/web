import { Dropdown, MenuProps } from "antd";
import firebase from "firebase";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import CaretDownIcon from "src/assets/caretDown.png";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { shortenString, showGenericErrorAlert } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import Swal from "sweetalert2";

export const SignedInOrganization = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const organization = useSelector(getOrganization);

  const _generateInviteLink = async () => {
    try {
      const res = await Api.organization.generateInviteLink(
        organization!._id.toString()
      );
      const { url } = res.data;
      Swal.fire({
        width: 800,
        html: `<h2 style="padding-top: 15px;">Here's an invite link</h3><p style="text-align: left; padding-top: 12px;">Send this link to the person you want to invite to ${organization?.name}. This link will expire once it gets used or after 24 hours if it's never used.</p><a href={${url}} style="color: rgb(50,50,50);">${url}</a>`,
      });
    } catch (e) {
      showGenericErrorAlert(e);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <label style={styles.signOutBtn}>Sign out</label>,
      onClick: () => firebase.auth().signOut(),
    },
    {
      key: "2",
      label: (
        <label style={styles.generateInviteLink}>Invite team member</label>
      ),
      onClick: _generateInviteLink,
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
    height: 60,
    backgroundColor: Colors.veryLightGray,
    width: "100%",
    cursor: "pointer",
    border: "none",
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  topHorizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  orgName: {
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  caretDownIcon: {
    width: 12,
    height: 10,
    marginLeft: 15,
  },
  signOutBtn: {
    cursor: "pointer",
    color: Colors.red,
  },
  generateInviteLink: {
    cursor: "pointer",
  },
};
