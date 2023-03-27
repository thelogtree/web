import React, { useEffect, useMemo, useState } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { FrontendLog } from "../lib";
import moment from "moment-timezone";
import { now } from "lodash";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [justCopied, setJustCopied] = useState<boolean>(false);

  const formattedString = useMemo(() => {
    const now = moment(log.createdAt);
    return (
      now.format("MM/DD/YYYY hh:mm:ss A") +
      " " +
      moment.tz(moment.tz.guess()).zoneAbbr()
    );
  }, [log._id]);

  const copyText = useMemo(() => {
    if (justCopied) {
      return "📋 copied!";
    }
    return isHovering ? "📋 click to copy" : "";
  }, [justCopied, isHovering]);

  const textToCopy = useMemo(() => {
    return `${formattedString}\n${log.content}`;
  }, [log._id]);

  useEffect(() => {
    if (justCopied) {
      setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    }
  }, [justCopied]);

  return (
    <div style={styles.container}>
      <label style={styles.logCreatedAt}>
        {formattedString}
        <span style={styles.copyText}>{copyText}</span>
      </label>
      <CopyToClipboard text={textToCopy} onCopy={() => setJustCopied(true)}>
        <div style={styles.copyBtn}>
          <pre
            style={styles.pre}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {log.content}
          </pre>
        </div>
      </CopyToClipboard>
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
    fontSize: 13,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    padding: 15,
    textAlign: "left",
  },
  logCreatedAt: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 6,
  },
  copyBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
  },
  copyText: {
    paddingLeft: 15,
    fontWeight: 300,
  },
};
