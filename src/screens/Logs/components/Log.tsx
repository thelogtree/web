import { Tooltip } from "antd";
import { simplifiedLogTagEnum } from "logtree-types";
import moment from "moment-timezone";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import {
  GLOBAL_SEARCH_SUFFIX,
  LOGS_ROUTE_PREFIX,
  SUPPORT_TOOL_SUFFIX,
} from "src/RouteManager";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import {
  FrontendLog,
  useAdditionalContextOfLogManager,
  useDeleteLog,
  useIsFavoriteLogsScreen,
  useIsGlobalSearchScreen,
} from "../lib";
import { DeletedLogRedBox } from "./DeletedLogRedBox";
import { DeleteProgressBar } from "./DeleteProgressBar";
import { FlipToAdditionalContextButton } from "./FlipToAdditionalContextButton";
import { OpenExternalLink } from "./OpenExternalLink";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const isOnGlobalSearch = useIsGlobalSearchScreen();
  const isOnFavoritesScreen = useIsFavoriteLogsScreen();
  const {
    shouldShowAsDeleted,
    onMouseDown,
    onMouseUp,
    isMouseDown,
    onMouseMove,
  } = useDeleteLog(log._id);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [justCopied, setJustCopied] = useState<boolean>(false);
  const [isDeleteBarVisibleAndAnimating, setIsDeleteBarVisibleAndAnimating] =
    useState<boolean>(false);
  const {
    isShowingAdditionalContext,
    setIsShowingAdditionalContext,
    additionalContextString,
  } = useAdditionalContextOfLogManager(log);
  const canJumpToNewChannel = isOnGlobalSearch || isOnFavoritesScreen;
  const canCopyText = !isDeleteBarVisibleAndAnimating && !shouldShowAsDeleted;

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
    if (shouldShowAsDeleted) {
      return "";
    } else if (justCopied) {
      return "Copied!";
    } else if (isDeleteBarVisibleAndAnimating && isMouseDown) {
      return "Deleting";
    }
    return isHovering ? "Click to copy, hold to delete" : "";
  }, [
    justCopied,
    isHovering,
    shouldShowAsDeleted,
    isDeleteBarVisibleAndAnimating,
    isMouseDown,
  ]);

  const textToCopy = useMemo(() => {
    return canCopyText
      ? `${formattedString}\n${
          isShowingAdditionalContext ? additionalContextString : log.content
        }`
      : "";
  }, [log._id, canCopyText, isShowingAdditionalContext]);

  const _searchForReferenceId = () => {
    window.open(
      `/org/${organization!.slug}${GLOBAL_SEARCH_SUFFIX}?query=id:${
        log.referenceId
      }`,
      "_blank"
    );
  };

  const _goToOtherChannel = () => {
    if (canJumpToNewChannel) {
      history.push(
        `/org/${organization!.slug}${LOGS_ROUTE_PREFIX}${log.folderFullPath}`
      );
    }
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
    onMouseUp();
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
              className={canJumpToNewChannel ? "logFolderPath" : undefined}
            >
              {log.folderFullPath}
            </span>
          ) : null}
          {log.sourceTitle ? (
            <span style={styles.sourceTitle}>{log.sourceTitle}</span>
          ) : null}
          <OpenExternalLink log={log} />
          <span style={styles.copyText}>{copyText}</span>
          <DeleteProgressBar
            shouldShowAsDeleted={shouldShowAsDeleted}
            isMouseDown={isMouseDown}
            isVisibleAndAnimating={isDeleteBarVisibleAndAnimating}
            setIsVisibleAndAnimating={setIsDeleteBarVisibleAndAnimating}
          />
        </div>
        <div style={styles.rightSide}>
          <FlipToAdditionalContextButton
            log={log}
            isShowingAdditionalContext={isShowingAdditionalContext}
            setIsShowingAdditionalContext={setIsShowingAdditionalContext}
          />
          {log.referenceId && (
            <Tooltip title="Click to do a Global Search for this ID">
              <a
                style={styles.referenceId}
                onClick={_searchForReferenceId}
                className="referenceIdLink"
              >
                id:{log.referenceId}
              </a>
            </Tooltip>
          )}
        </div>
      </div>
      <CopyToClipboard
        text={textToCopy}
        onCopy={() => (canCopyText ? setJustCopied(true) : null)}
      >
        <div style={styles.copyBtn}>
          <pre
            style={{
              ...styles.pre,
              ...(log.tag === simplifiedLogTagEnum.Error &&
                styles.errorTaggedLog),
              ...(isShowingAdditionalContext && styles.preContext),
            }}
            onMouseEnter={_onMouseEnter}
            onMouseLeave={_onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {shouldShowAsDeleted && <DeletedLogRedBox />}
            {isShowingAdditionalContext ? additionalContextString : log.content}
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
