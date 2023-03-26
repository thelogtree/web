import React, { useMemo } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { FrontendLog } from "../lib";
import moment from "moment-timezone";
import { now } from "lodash";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const formattedString = useMemo(() => {
    const now = moment(log.createdAt);
    return (
      now.format("MM/DD/YYYY hh:mm:ss A") +
      " " +
      moment.tz(moment.tz.guess()).zoneAbbr()
    );
  }, [log._id]);

  return (
    <div style={styles.container}>
      <label style={styles.logCreatedAt}>{formattedString}</label>
      <pre style={styles.pre}>{log.content}</pre>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 10,
  },
  pre: {
    backgroundColor: Colors.veryLightGray,
    color: Colors.black,
    borderRadius: 4,
    padding: 15,
    fontSize: 13,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
  },
  logCreatedAt: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 6,
  },
};
