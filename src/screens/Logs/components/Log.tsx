import React, { useEffect, useMemo, useState } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { FrontendLog, useIsGlobalSearchScreen } from "../lib";
import moment from "moment-timezone";
import { now, startCase } from "lodash";
import CopyToClipboard from "react-copy-to-clipboard";
import { sentenceCase } from "src/utils/helpers";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { useHistory } from "react-router-dom";
import { Tooltip } from "antd";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const isOnGlobalSearch = useIsGlobalSearchScreen();
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
      return "📋 Copied!";
    }
    return isHovering ? "📋 Click to copy" : "";
  }, [justCopied, isHovering]);

  const textToCopy = useMemo(() => {
    return `${formattedString}\n\n${log.content}`;
  }, [log._id]);

  const searchForReferenceId = () => {
    history.push(`/org/${organization!.slug}/search?query=${log.referenceId}`);
  };

  useEffect(() => {
    if (justCopied) {
      setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    }
  }, [justCopied]);

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <label style={styles.leftSide}>
          <span>{modifiedFormattedString}</span>
          <span style={styles.folderFullPath}>{log?.folderFullPath}</span>
          <span style={styles.copyText}>{copyText}</span>
        </label>
        {log.referenceId && (
          <Tooltip
            title={
              isOnGlobalSearch ? "" : "Click to do a Global Search on this ID"
            }
          >
            <a
              style={styles.rightSide}
              onClick={isOnGlobalSearch ? undefined : searchForReferenceId}
              className={isOnGlobalSearch ? undefined : "referenceIdLink"}
            >
              id:{log.referenceId}
            </a>
          </Tooltip>
        )}
      </div>
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
  leftSide: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 6,
  },
  rightSide: {
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
