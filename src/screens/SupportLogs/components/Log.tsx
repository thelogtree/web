import { simplifiedLogTagEnum } from "logtree-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { OpenExternalLink } from "src/screens/Logs/components/OpenExternalLink";
import { FrontendLog } from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { useLogFormattedTexts } from "../lib";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const organization = useSelector(getOrganization);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [justCopied, setJustCopied] = useState<boolean>(false);
  const { modifiedFormattedString, textToCopy } = useLogFormattedTexts(log);

  const copyText = useMemo(() => {
    if (justCopied) {
      return "Copied!";
    } else if (isHovering) {
      return "Click to copy";
    }
    return "";
  }, [justCopied, isHovering]);

  const logTagColorAndText = useMemo(() => {
    if (!log.tag) {
      return { accentColor: undefined, backgroundColor: undefined, text: "" };
    } else if (log.tag === simplifiedLogTagEnum.Error) {
      return {
        accentColor: Colors.red,
        backgroundColor: Colors.veryLightRed,
        text: "Error",
      };
    } else if (log.tag === simplifiedLogTagEnum.Tracking) {
      return {
        accentColor: Colors.blueishPurple,
        backgroundColor: Colors.veryLightBlueishPurple,
        text: "",
      };
    }
    return { accentColor: undefined, backgroundColor: undefined, text: "" };
  }, []);

  const _goToOtherChannel = () => {
    window.open(
      `/org/${organization!.slug}${LOGS_ROUTE_PREFIX}${log.folderFullPath}`,
      "_blank"
    );
  };

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

  const _onJustCopied = useCallback(() => {
    setJustCopied(true);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <div style={styles.leftSide}>
          <span>{modifiedFormattedString}</span>
          {log.folderFullPath ? (
            <span
              style={styles.folderFullPath}
              onClick={_goToOtherChannel}
              className="logFolderPath"
            >
              {log.folderFullPath}
            </span>
          ) : null}
          {log.sourceTitle ? (
            <span style={styles.sourceTitle}>{log.sourceTitle}</span>
          ) : null}
          {logTagColorAndText.text ? (
            <span
              style={{
                ...styles.logTag,
                color: logTagColorAndText.accentColor,
              }}
            >
              {logTagColorAndText.text}
            </span>
          ) : null}
          <OpenExternalLink log={log} />
          <span style={styles.copyText}>{copyText}</span>
        </div>
        {log.referenceId && (
          <span style={styles.rightSide}>id:{log.referenceId}</span>
        )}
      </div>
      <CopyToClipboard text={textToCopy} onCopy={_onJustCopied}>
        <div style={styles.copyBtn}>
          <pre
            style={{
              ...styles.pre,
              ...(logTagColorAndText.accentColor && {
                borderColor: logTagColorAndText.accentColor,
              }),
              ...(logTagColorAndText.backgroundColor && {
                backgroundColor: logTagColorAndText.backgroundColor,
              }),
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
    textAlign: "right",
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
  logTag: {
    paddingLeft: 15,
    fontWeight: 500,
    fontSize: 12,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
};
