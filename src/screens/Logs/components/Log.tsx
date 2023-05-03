import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import {
  FrontendLog,
  useDeleteLog,
  useExternalLinkForLog,
  useIsFavoriteLogsScreen,
  useIsGlobalSearchScreen,
} from "../lib";
import moment from "moment-timezone";
import { now, startCase } from "lodash";
import CopyToClipboard from "react-copy-to-clipboard";
import { sentenceCase } from "src/utils/helpers";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { useHistory } from "react-router-dom";
import { Tooltip } from "antd";
import { OpenExternalLink } from "./OpenExternalLink";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { DeleteProgressBar } from "./DeleteProgressBar";
import { DeletedLogRedBox } from "./DeletedLogRedBox";

type Props = {
  log: FrontendLog;
};

export const Log = ({ log }: Props) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const isOnGlobalSearch = useIsGlobalSearchScreen();
  const isOnFavoritesScreen = useIsFavoriteLogsScreen();
  const { shouldShowAsDeleted, onMouseDown, onMouseUp, isMouseDown } =
    useDeleteLog(log._id);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [justCopied, setJustCopied] = useState<boolean>(false);
  const [isDeleteBarVisibleAndAnimating, setIsDeleteBarVisibleAndAnimating] =
    useState<boolean>(false);
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
    return canCopyText ? `${formattedString}\n${log.content}` : "";
  }, [log._id, canCopyText]);

  const _searchForReferenceId = () => {
    history.push(
      `/org/${organization!.slug}/search?query=id:${log.referenceId}`
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
          <span
            style={styles.folderFullPath}
            onClick={_goToOtherChannel}
            className={canJumpToNewChannel ? "logFolderPath" : undefined}
          >
            {log?.folderFullPath}
          </span>
          <OpenExternalLink log={log} />
          <span style={styles.copyText}>{copyText}</span>
          <DeleteProgressBar
            shouldShowAsDeleted={shouldShowAsDeleted}
            isMouseDown={isMouseDown}
            isVisibleAndAnimating={isDeleteBarVisibleAndAnimating}
            setIsVisibleAndAnimating={setIsDeleteBarVisibleAndAnimating}
          />
        </div>
        {log.referenceId && (
          <Tooltip
            title={
              isOnGlobalSearch ? "" : "Click to do a Global Search on this ID"
            }
          >
            <a
              style={styles.rightSide}
              onClick={isOnGlobalSearch ? undefined : _searchForReferenceId}
              className={isOnGlobalSearch ? undefined : "referenceIdLink"}
            >
              id:{log.referenceId}
            </a>
          </Tooltip>
        )}
      </div>
      <CopyToClipboard
        text={textToCopy}
        onCopy={() => (canCopyText ? setJustCopied(true) : null)}
      >
        <div style={styles.copyBtn}>
          <pre
            style={styles.pre}
            onMouseEnter={_onMouseEnter}
            onMouseLeave={_onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            {shouldShowAsDeleted && <DeletedLogRedBox />}
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
