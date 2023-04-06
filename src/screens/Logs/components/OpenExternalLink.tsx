import React from "react";
import { FrontendLog, useExternalLinkForLog } from "../lib";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { Tooltip } from "antd";
import LinkIcon from "src/assets/link.png";

type Props = {
  log: FrontendLog;
};

export const OpenExternalLink = ({ log }: Props) => {
  const externalLink = useExternalLinkForLog(log);

  const _openExternalLink = () => {
    window.open(externalLink, "_blank");
  };

  if (!externalLink) {
    return null;
  }

  return (
    <Tooltip title={`Go to ${externalLink}`}>
      <button style={styles.openBtn} onClick={_openExternalLink}>
        <img src={LinkIcon} style={styles.openExternalLinkIcon} />
        <label style={styles.openText}>View more</label>
      </button>
    </Tooltip>
  );
};

const styles: StylesType = {
  openBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: 6,
    fontSize: 12,
    backgroundColor: Colors.transparent,
  },
  openExternalLinkIcon: {
    width: 13,
    height: 13,
    cursor: "pointer",
  },
  openText: {
    color: Colors.gray,
    fontSize: 12,
    paddingLeft: 4,
    cursor: "pointer",
  },
};
