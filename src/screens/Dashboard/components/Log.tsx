import { simplifiedLogTagEnum } from "logtree-types";
import moment from "moment-timezone";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FlipToAdditionalContextButton } from "src/screens/Logs/components/FlipToAdditionalContextButton";
import { OpenExternalLink } from "src/screens/Logs/components/OpenExternalLink";
import {
  FrontendLog,
  useAdditionalContextOfLogManager,
} from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [justCopied, setJustCopied] = useState<boolean>(false);

  const formattedString = useMemo(() => {
    const logCreatedAt = moment(log.createdAt);
    const isToday = logCreatedAt.isSame(new Date(), "day");
    return (
      (isToday ? "Today at" : "") +
      logCreatedAt.format(`${isToday ? "" : "MM/DD/YYYY"} hh:mm:ss A`) +
      " " +
      moment.tz(moment.tz.guess()).zoneAbbr()
    );
  }, [log._id]);

  const modifiedFormattedString = useMemo(() => {
    const logCreatedAt = moment(log.createdAt);
    const isRecent = moment().diff(logCreatedAt, "hours") <= 1;
    const fromNow = logCreatedAt.fromNow();
    return isRecent ? fromNow : formattedString;
  }, [log._id, formattedString]);

  const copyText = useMemo(() => {
    if (justCopied) {
      return "Copied!";
    }
    return isHovering ? "Click to copy" : "";
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

  const _onMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const _onMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <div style={styles.leftSide}>
          <span>{modifiedFormattedString}</span>
          <OpenExternalLink log={log} />
          <span style={styles.copyText}>{copyText}</span>
        </div>
        <div style={styles.rightSide}>
          {log.referenceId && (
            <span style={styles.referenceId}>id:{log.referenceId}</span>
          )}
        </div>
      </div>
      <CopyToClipboard text={textToCopy} onCopy={() => setJustCopied(true)}>
        <div style={styles.copyBtn}>
          <pre
            style={{
              ...styles.pre,
              ...(log.tag === simplifiedLogTagEnum.Error &&
                styles.errorTaggedLog),
            }}
            onMouseEnter={_onMouseEnter}
            onMouseLeave={_onMouseLeave}
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
    whiteSpace: "pre-wrap",
    position: "relative",
  },
  preContext: {
    backgroundColor: Colors.white,
    color: Colors.black,
    borderRadius: 4,
    fontSize: 13,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.black,
    borderStyle: "solid",
    padding: 15,
    textAlign: "left",
    whiteSpace: "pre-wrap",
    position: "relative",
  },
  errorTaggedLog: {
    backgroundColor: Colors.veryLightRed,
    borderColor: Colors.red,
  },
  leftSide: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rightSide: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  referenceId: {
    color: Colors.gray,
    textAlign: "right",
    marginLeft: 6,
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
  sourceTitle: {
    paddingLeft: 15,
    fontWeight: 300,
  },
  folderFullPath: {
    paddingLeft: 15,
    fontWeight: 300,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
};
