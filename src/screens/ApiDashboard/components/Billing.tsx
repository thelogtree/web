import React from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import _ from "lodash";
import { numberToNumberWithCommas } from "src/utils/helpers";
import moment from "moment-timezone";

export const Billing = () => {
  const organization = useSelector(getOrganization);

  return (
    <div style={styles.container}>
      <label style={styles.billingSectionTitle}>USAGE</label>
      <label style={styles.info}>
        Events sent:{" "}
        <b>{numberToNumberWithCommas(organization!.numLogsSentInPeriod)}</b>
      </label>
      <label style={{ ...styles.info, paddingTop: 8 }}>
        Event limit:{" "}
        <b>{numberToNumberWithCommas(organization!.logLimitForPeriod)}</b>
      </label>
      {organization!.cycleEnds ? (
        <label style={styles.usageResetNote}>
          Your usage will reset on{" "}
          {moment(organization?.cycleEnds).format("MM/DD/YYYY")}. Events will be
          kept for {organization?.logRetentionInDays} days. Email
          hello@logtree.co to increase your limit.
        </label>
      ) : null}
      {organization!.numLogsSentInPeriod >= organization!.logLimitForPeriod ? (
        <label style={styles.noMoreLogs}>
          You cannot send any more events right now.
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
  noMoreLogs: {
    color: Colors.red,
    fontSize: 13,
    paddingTop: 10,
  },
  usageResetNote: {
    color: Colors.darkGray,
    fontSize: 13,
    paddingTop: 10,
  },
};
