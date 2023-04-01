import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ChannelIcon from "src/assets/channel.png";
import FolderIcon from "src/assets/folder.png";
import OpenFolderIcon from "src/assets/openFolder.png";
import { getOrganization } from "src/redux/organization/selector";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { Options } from "src/screens/Logs/components/Options";
import {
  useChildrenHasUnreadLogs,
  useFullFolderPathFromUrl,
} from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { shortenString } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

import { FrontendFolder } from "./Folders";

type Props = {
  folderOrChannel: FrontendFolder;
  hasTopBorder?: boolean;
  extraMarginLeft?: number;
};

const PADDING_LEFT_INCREMENT = 15;

export const FolderOrChannel = ({
  folderOrChannel,
  hasTopBorder,
  extraMarginLeft = 0,
}: Props) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [children, setChildren] = useState<FrontendFolder[]>([]);
  const isChannel = !folderOrChannel.children.length;
  const fullFolderPath = useFullFolderPathFromUrl();
  const isSelected = folderOrChannel.fullPath === fullFolderPath;
  const childrenIncludesUnreadChannel =
    useChildrenHasUnreadLogs(folderOrChannel);

  const icon = useMemo(() => {
    if (isChannel) {
      return ChannelIcon;
    }
    return children.length ? OpenFolderIcon : FolderIcon;
  }, [isChannel, children.length]);

  const _onPress = () => {
    if (isSelected && childrenIncludesUnreadChannel) {
      window.location.reload();
      return;
    }
    if (!isSelected && isChannel) {
      history.push(
        `/org/${organization?.slug}${LOGS_ROUTE_PREFIX}${folderOrChannel.fullPath}`
      );
      return;
    }
    setChildren(children.length ? [] : folderOrChannel.children);
  };

  useEffect(() => {
    // if the url is at this path already, show the children
    if (fullFolderPath.indexOf(folderOrChannel.fullPath) === 0) {
      setChildren(folderOrChannel.children);
    } else if (children.length) {
      setChildren(folderOrChannel.children); // if folder is already open, show updated in its children
    }
  }, [fullFolderPath, JSON.stringify(folderOrChannel)]);

  return (
    <>
      <button
        style={{
          ...styles.container,
          ...(hasTopBorder && styles.topBorder),
          ...((isHovering || isSelected) && {
            backgroundColor: Colors.lightGray,
          }),
          ...(isSelected && { cursor: "default" }),
          paddingLeft: extraMarginLeft + 15,
          ...(folderOrChannel.isMuted && { opacity: 0.5 }),
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={_onPress}
      >
        <div style={styles.innerButtonLeftSide}>
          <img
            src={icon}
            style={{ ...styles.icon, ...(isSelected && { cursor: "auto" }) }}
          />
          <label
            style={{
              ...styles.name,
              ...(isSelected && { cursor: "auto" }),
              ...(childrenIncludesUnreadChannel &&
                !folderOrChannel.isMuted &&
                styles.hasUnreadLogs),
            }}
          >
            {shortenString(folderOrChannel.name, 16)}
          </label>
        </div>
        {isHovering && <Options folderOrChannel={folderOrChannel} />}
      </button>
      {children.map((child) => (
        <FolderOrChannel
          folderOrChannel={child}
          extraMarginLeft={extraMarginLeft + PADDING_LEFT_INCREMENT}
          key={child._id}
        />
      ))}
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 33,
    backgroundColor: Colors.transparent,
    outline: "none",
    border: "none",
    // borderBottomColor: Colors.lightGray,
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    cursor: "pointer",
  },
  icon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  name: {
    paddingLeft: 6,
    cursor: "pointer",
    paddingRight: 6,
    fontSize: 14,
    fontWeight: 300,
  },
  topBorder: {
    // borderTopStyle: "solid",
    // borderTopWidth: 1,
    // borderTopColor: Colors.lightGray,
  },
  innerButtonLeftSide: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  hasUnreadLogs: {
    fontWeight: 700,
  },
};
