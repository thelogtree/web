import { Dropdown, MenuProps } from "antd";
import firebase from "firebase";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CaretDownIcon from "src/assets/caretDown.png";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { shortenString } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

const ZAPIER_INVITE_LINK =
  "https://zapier.com/developer/public-invite/180777/c6de2f8899d569621d0ffb574a601391/";

export const SignedInOrganization = () => {
  const history = useHistory();
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const organization = useSelector(getOrganization);
  const teamPath = `/org/${organization?.slug}/team`;
  const _goToTeamScreen = () => history.push(teamPath);
  const _connectIntegrationsClicked = () => {
    window.open(ZAPIER_INVITE_LINK, "_blank");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <label style={styles.normalBtn}>Team members</label>,
      onClick: _goToTeamScreen,
    },
    {
      key: "2",
      label: <label style={styles.normalBtn}>Connect Zapier</label>,
      onClick: _connectIntegrationsClicked,
    },
    {
      type: "divider",
      style: styles.menuDivider,
    },
    {
      key: "3",
      label: <label style={styles.signOutBtn}>Sign out</label>,
      onClick: () => firebase.auth().signOut(),
    },
    {
      key: "4",
      label: <label style={styles.helpBtn}>Contact us</label>,
      onClick: () => window.open("mailto:hello@logtree.co", "_blank"),
    },
    {
      key: "5",
      label: <label style={styles.helpBtn}>Terms of service</label>,
      onClick: () => window.open("/policies/terms-of-service", "_blank"),
    },
    {
      key: "6",
      label: <label style={styles.helpBtn}>Privacy policy</label>,
      onClick: () => window.open("/policies/privacy-policy", "_blank"),
    },
  ];

  return organization ? (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      overlayStyle={{ minWidth: 200 }}
    >
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
    fontSize: 12,
  },
  helpBtn: {
    cursor: "pointer",
    color: Colors.gray,
    fontSize: 12,
  },
  normalBtn: {
    cursor: "pointer",
    color: Colors.darkGray,
  },
  generateInviteLink: {
    cursor: "pointer",
  },
  menuDivider: {
    marginTop: 6,
    marginBottom: 6,
  },
};
