import React, { useEffect, useState } from "react";
import { FrontendFolder } from "./Folders";
import { StylesType } from "src/utils/styles";
import FolderIcon from "src/assets/folder.png";
import ChannelIcon from "src/assets/channel.png";
import { Colors } from "src/utils/colors";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { LOGS_ROUTE_PREFIX } from "src/RouteManager";
import { useFullFolderPathFromUrl } from "src/screens/Logs/lib";
import { shortenString } from "src/utils/helpers";

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

  const _onPress = () => {
    if (isChannel) {
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
    }
  }, [fullFolderPath]);

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
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={_onPress}
      >
        <img
          src={isChannel ? ChannelIcon : FolderIcon}
          style={{ ...styles.icon, ...(isSelected && { cursor: "auto" }) }}
        />
        <label
          style={{ ...styles.name, ...(isSelected && { cursor: "auto" }) }}
        >
          {shortenString(folderOrChannel.name, 20)}
        </label>
      </button>
      {children.map((child) => (
        <FolderOrChannel
          folderOrChannel={child}
          extraMarginLeft={extraMarginLeft + PADDING_LEFT_INCREMENT}
        />
      ))}
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 40,
    backgroundColor: Colors.transparent,
    outline: "none",
    border: "none",
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
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
  },
  topBorder: {
    borderTopStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
};
