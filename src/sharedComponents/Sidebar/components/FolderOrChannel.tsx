import React, { useState } from "react";
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

type Props = {
  folderOrChannel: FrontendFolder;
  index: number;
};

export const FolderOrChannel = ({ folderOrChannel, index }: Props) => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const isChannel = !folderOrChannel.children.length;
  const fullFolderPath = useFullFolderPathFromUrl();
  const isSelected = folderOrChannel.fullPath === fullFolderPath;

  return (
    <button
      style={{
        ...styles.container,
        ...(!index && styles.topBorder),
        ...((isHovering || isSelected) && {
          backgroundColor: Colors.lightGray,
        }),
        ...(isSelected && { cursor: "default" }),
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() =>
        history.push(
          `/org/${organization?.slug}${LOGS_ROUTE_PREFIX}${folderOrChannel.fullPath}`
        )
      }
    >
      <img
        src={isChannel ? ChannelIcon : FolderIcon}
        style={{ ...styles.icon, ...(isSelected && { cursor: "auto" }) }}
      />
      <label style={{ ...styles.name, ...(isSelected && { cursor: "auto" }) }}>
        {folderOrChannel.name}
      </label>
    </button>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 15,
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
