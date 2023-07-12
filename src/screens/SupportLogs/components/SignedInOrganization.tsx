import { Dropdown, MenuProps } from "antd";
import firebase from "firebase";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CaretDownIcon from "src/assets/caretDown.png";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { shortenString, usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export const ZAPIER_INVITE_LINK =
  "https://zapier.com/developer/public-invite/180777/c6de2f8899d569621d0ffb574a601391/";

export const SignedInOrganization = () => {
  const history = useHistory();
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const organization = useSelector(getOrganization);
  const _goToTeamScreen = () => history.push(`/org/${organization?.slug}/team`);
  const pathname = usePathname();
  const isOnIntegrations = pathname.includes("/integrations");
  const isOnSearch = pathname.includes("/journey");
  const _goToIntegrationsScreen = () =>
    history.push(`/org/${organization?.slug}/integrations`);
  const _goToSearchScreen = () =>
    history.push(`/org/${organization?.slug}/journey`);
  const _connectIntegrationsClicked = () => {
    window.open(ZAPIER_INVITE_LINK, "_blank");
  };

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <label
          style={{
            ...styles.normalBtn,
            ...(isOnSearch && { cursor: "default", opacity: 0.3 }),
          }}
        >
          Search for user's activity
        </label>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation();
        _goToSearchScreen();
      },
      disabled: isOnSearch,
    },
    {
      key: "1",
      label: (
        <label
          style={{
            ...styles.normalBtn,
            ...(isOnIntegrations && { cursor: "default", opacity: 0.3 }),
          }}
        >
          Manage integrations
        </label>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation();
        _goToIntegrationsScreen();
      },
      disabled: isOnIntegrations,
    },
    {
      key: "2",
      label: <label style={styles.normalBtn}>Team members</label>,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        _goToTeamScreen();
      },
    },
    {
      type: "divider",
      style: styles.menuDivider,
    },
    {
      key: "3",
      label: <label style={styles.signOutBtn}>Sign out</label>,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        firebase.auth().signOut();
      },
    },
    {
      key: "4",
      label: <label style={styles.helpBtn}>Contact us</label>,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        window.open("mailto:hello@logtree.co", "_blank");
      },
    },
    {
      key: "5",
      label: <label style={styles.helpBtn}>Terms of service</label>,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        window.open("/policies/terms-of-service", "_blank");
      },
    },
    {
      key: "6",
      label: <label style={styles.helpBtn}>Privacy policy</label>,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        window.open("/policies/privacy-policy", "_blank");
      },
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
          <label style={styles.orgName}>Menu</label>
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
    backgroundColor: Colors.white,
    // borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: Colors.gray,
    border: "none",
    // width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 8,
    cursor: "pointer",
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
    fontWeight: 500,
    cursor: "pointer",
    color: Colors.darkGray,
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
