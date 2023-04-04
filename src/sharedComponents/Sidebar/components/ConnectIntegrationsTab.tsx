import React from "react";
import IntegrationsIcon from "src/assets/integrations.png";
import { StylesType } from "src/utils/styles";

const ZAPIER_INVITE_LINK =
  "https://zapier.com/developer/public-invite/180777/c6de2f8899d569621d0ffb574a601391/";

export const ConnectIntegrationsTab = () => {
  const _connectIntegrationsClicked = () => {
    window.open(ZAPIER_INVITE_LINK, "_blank");
  };

  return (
    <>
      <button
        style={styles.container}
        onClick={_connectIntegrationsClicked}
        className="tab"
      >
        <div style={styles.innerButtonLeftSide}>
          <img src={IntegrationsIcon} style={styles.icon} />
          <label style={styles.name}>Connect Zapier</label>
        </div>
      </button>
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: 33,
    outline: "none",
    border: "none",
    // borderBottomColor: Colors.lightGray,
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    cursor: "pointer",
    paddingLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  name: {
    paddingLeft: 6,
    cursor: "pointer",
    paddingRight: 6,
    fontSize: 14,
    fontWeight: 300,
  },
  innerButtonLeftSide: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};
