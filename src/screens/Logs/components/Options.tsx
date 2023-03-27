import React, { useState } from "react";
import { Dropdown, MenuProps } from "antd";
import MenuIcon from "src/assets/threeDots.png";
import { StylesType } from "src/utils/styles";
import Swal from "sweetalert2";
import { Api } from "src/api";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { useFetchFolders } from "src/redux/actionIndex";
import { useHistory } from "react-router-dom";
import { FrontendFolder } from "src/sharedComponents/Sidebar/components/Folders";
import { Colors } from "src/utils/colors";
import { useFullFolderPathFromUrl } from "../lib";

type Props = {
  folderOrChannel: FrontendFolder;
};

export const Options = ({ folderOrChannel }: Props) => {
  const isChannel = !folderOrChannel.children.length;
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const fullFolderPath = useFullFolderPathFromUrl();
  const currentPathWillBeDeleted = fullFolderPath.includes(
    folderOrChannel.fullPath
  );
  const { fetch: fetchFolders } = useFetchFolders();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _confirmDeleteFolderAndEverythingInside = async () => {
    if (isLoading) {
      return;
    }
    const res = await Swal.fire({
      title: "Please confirm",
      text: isChannel
        ? "Deleting this channel will delete all logs inside of it too. This may take a few seconds."
        : "Deleting this folder will delete everything inside of it, including logs and subfolders. This may take a few seconds.",
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
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <label style={styles.delete}>Delete</label>,
      onClick: _confirmDeleteFolderAndEverythingInside,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <img
        src={MenuIcon}
        style={styles.container}
        onClick={(e) => e.stopPropagation()}
      />
    </Dropdown>
  );
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
};
