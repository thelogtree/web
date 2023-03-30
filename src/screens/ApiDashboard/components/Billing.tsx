import React from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import _ from "lodash";

export const Billing = () => {
  const organization = useSelector(getOrganization);

  return (
    <div style={styles.container}>
      <label style={styles.billingSectionTitle}>BILLING</label>
      <label style={styles.info}>
        Credits remaining: ${_.round(organization!.currentCredits, 3)}
      </label>
      <label style={{ ...styles.info, paddingTop: 8 }}>
        Upcoming charges: ${_.round(organization!.currentCharges, 3)}
      </label>
      {organization?.currentCharges ? (
        <label style={styles.reachOut}>
          Don't worry about this yet, we'll reach out to you when it's time to
          pay us.
        </label>
      ) : null}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 25,
    borderRadius: 8,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    position: "relative",
  },
  billingSectionTitle: {
    fontWeight: 300,
    backgroundColor: Colors.white,
    color: Colors.darkGray,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    position: "absolute",
    top: -15,
    left: 18,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    letterSpacing: 1,
  },
  info: {
    color: Colors.black,
    fontSize: 15,
  },
  reachOut: {
    color: Colors.darkGray,
    fontSize: 12,
    paddingTop: 14,
  },
};
