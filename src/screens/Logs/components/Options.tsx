import React, { useState } from "react";
import { Dropdown, MenuProps } from "antd";
import MenuIcon from "src/assets/threeDots.png";
import { StylesType } from "src/utils/styles";
import Swal from "sweetalert2";
import { Api } from "src/api";
import { useSelector } from "react-redux";
import { getOrganization, getUser } from "src/redux/organization/selector";
import { useFetchFolders } from "src/redux/actionIndex";
import { useHistory } from "react-router-dom";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { Colors } from "src/utils/colors";
import { useFullFolderPathFromUrl } from "../lib";
import { orgPermissionLevel } from "logtree-types";
import { showGenericErrorAlert } from "src/utils/helpers";

type Props = {
  folderOrChannel: FrontendFolder;
  isMutedBecauseOfParent: boolean;
};

export const Options = ({ folderOrChannel, isMutedBecauseOfParent }: Props) => {
  const isChannel = !folderOrChannel.children.length;
  const history = useHistory();
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const fullFolderPath = useFullFolderPathFromUrl();
  const currentPathWillBeDeleted = fullFolderPath.includes(
    folderOrChannel.fullPath
  );
  const { fetch: fetchFolders } = useFetchFolders();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isUserAnOrgAdmin =
    user?.orgPermissionLevel === orgPermissionLevel.Admin;

  const _confirmDeleteFolderAndEverythingInside = async () => {
    try {
      if (isLoading) {
        return;
      }
      const res = await Swal.fire({
        title: "Please confirm",
        text: isChannel
          ? "This will delete the channel for everyone in your organization. Deleting this channel will delete all logs inside of it too. If logs are sent to this channel later on, the channel will be re-created. Deleting may take a few seconds."
          : "This will delete the folder for everyone in your organization. Deleting this folder will delete everything inside of it, including logs, subfolders, and channels. If logs are sent to this folder later on, the folder will be re-created. Deleting may take a few seconds.",
        icon: "warning",
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: "Delete",
        cancelButtonText: "Cancel",
        showConfirmButton: false,
      });
      if (res.isDenied) {
        setIsLoading(true);
        await Api.organization.deleteFolderAndEverythingInside(
          organization!._id.toString(),
          folderOrChannel._id
        );
        await fetchFolders();
        setIsLoading(false);
        Swal.fire({ title: "Successfully deleted", icon: "success" });
        if (currentPathWillBeDeleted) {
          history.push(`/org/${organization?.slug}/api-dashboard`);
        }
      }
    } catch (e) {
      showGenericErrorAlert(e);
    }
  };

  const _muteOrUnmuteChannel = async () => {
    try {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      await Api.organization.setFolderPreference(
        organization!._id.toString(),
        folderOrChannel.fullPath,
        !folderOrChannel.isMuted
      );
      await fetchFolders();
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const items: MenuProps["items"] = [
    ...(isUserAnOrgAdmin
      ? [
          {
            key: "1",
            label: <label style={styles.delete}>Delete</label>,
            onClick: _confirmDeleteFolderAndEverythingInside,
          },
        ]
      : []),
    {
      key: "2",
      label: (
        <label
          style={isMutedBecauseOfParent ? styles.cannotUnmute : styles.mute}
        >
          {isMutedBecauseOfParent
            ? "Cannot unmute because a parent folder is muted"
            : folderOrChannel.isMuted
            ? "Unmute"
            : "Mute"}
        </label>
      ),
      onClick: isMutedBecauseOfParent ? undefined : _muteOrUnmuteChannel,
    },
  ];

  return items.length ? (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <img
        src={MenuIcon}
        style={styles.container}
        onClick={(e) => e.stopPropagation()}
      />
    </Dropdown>
  ) : null;
};

const styles: StylesType = {
  container: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  delete: {
    color: Colors.red,
    cursor: "pointer",
  },
  mute: {
    color: Colors.darkGray,
    cursor: "pointer",
  },
  cannotUnmute: {
    color: Colors.darkGray,
    cursor: "default",
    opacity: 0.4,
  },
};
