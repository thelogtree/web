import React from "react";
import { StylesType } from "src/utils/styles";
import LightningIcon from "src/assets/lightning.png";
import RewindIcon from "src/assets/rewind.png";
import FoldersIcon from "src/assets/blueFolders.png";
import { Colors } from "src/utils/colors";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";

export const HypeDescription = () => {
  const organization = useSelector(getOrganization);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.infoContainer, paddingTop: 0 }}>
        <img style={styles.icon} src={LightningIcon} />
        <div style={styles.rightContainer}>
          <label style={styles.descLbl}>Lightning fast</label>
          <label style={styles.smallDescLbl}>
            Learn about your users' actions 10x faster than Slack, Logtail, and
            Mixpanel.
          </label>
        </div>
      </div>
      <div style={styles.infoContainer}>
        <img style={styles.icon} src={RewindIcon} />
        <div style={styles.rightContainer}>
          <label style={styles.descLbl}>Your personal time machine</label>
          <label style={styles.smallDescLbl}>
            Search for logs from up to {organization?.logRetentionInDays} days
            ago.
          </label>
        </div>
      </div>
      <div style={styles.infoContainer}>
        <img style={styles.icon} src={FoldersIcon} />
        <div style={styles.rightContainer}>
          <label style={styles.descLbl}>Powerful efficiency</label>
          <label style={styles.smallDescLbl}>
            Search across all your folders and channels with one query.
          </label>
        </div>
      </div>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 25,
    backgroundColor: Colors.white,
    borderRadius: 8,
    boxShadow: "0px 4px 28px rgba(0,0,0,0.1)",
    padding: 38,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    borderWidth: 1,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  icon: {
    width: 50,
    height: 50,
  },
  descLbl: {
    fontSize: 20,
    color: Colors.black,
    paddingBottom: 10,
    fontWeight: 500,
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 12,
  },
  smallDescLbl: {
    fontSize: 14,
    color: Colors.darkGray,
    fontWeight: 300,
  },
};
