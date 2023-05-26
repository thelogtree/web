import { orgPermissionLevel } from "logtree-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { useFetchFolders } from "src/redux/actionIndex";
import { getOrganization, getUser } from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import PlusIcon from "src/assets/plusIcon.png";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { Modal, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import { LOGS_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";

export const AddNewChannel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [folderPath, setFolderPath] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const { fetch: refetchFolders } = useFetchFolders();
  const history = useHistory();

  const _createNewEmptyFolder = async () => {
    try {
      if (!folderPath) {
        throw new Error(
          "Please enter a name for your channel, starting with a slash (e.g. '/alerts')"
        );
      }
      setIsLoading(true);
      await Api.organization.createNewEmptyFolder(
        organization!._id.toString(),
        folderPath
      );
      await refetchFolders();
      _closeModal();
      history.push(
        `${ORG_ROUTE_PREFIX}/${organization?.slug}${LOGS_ROUTE_PREFIX}${folderPath}`
      );
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _closeModal = () => {
    setIsModalVisible(false);
    setFolderPath("");
  };

  if (!organization || user?.orgPermissionLevel !== orgPermissionLevel.Admin) {
    return null;
  }

  return (
    <>
      <Tooltip title="New channel">
        <button
          onClick={() => setIsModalVisible(true)}
          style={styles.newFolderBtn}
        >
          <img src={PlusIcon} style={styles.plusIcon} />
        </button>
      </Tooltip>
      <Modal
        open={isModalVisible}
        onCancel={_closeModal}
        width={700}
        onOk={_createNewEmptyFolder}
        okButtonProps={{ disabled: isLoading }}
        okText={isLoading ? "Creating..." : "Create"}
      >
        <div style={styles.container}>
          <label style={styles.title}>Create new channel</label>
          <label style={styles.desc}>
            If you haven't created a channel by the time you send your first log
            to it, we'll automatically create the channel for you. In other
            words, unless you want to set alerts for a channel ahead of time,
            you likely don't need to create a channel manually.
          </label>
          <input
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            style={styles.folderPathInput}
            placeholder="/name"
          />
          <label style={styles.validationNote}>
            Your channel name must start with a slash (e.g. "/my-alerts")
          </label>
        </div>
      </Modal>
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 30,
  },
  newFolderBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    cursor: "pointer",
    position: "relative",
    bottom: 2,
    marginLeft: 2,
  },
  plusIcon: {
    width: 15,
    height: 15,
    cursor: "pointer",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
  },
  desc: {
    fontSize: 13,
    color: Colors.darkerGray,
    paddingTop: 12,
    paddingBottom: 26,
    width: "100%",
  },
  folderPathInput: {
    outline: "none",
    border: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    width: "100%",
  },
  validationNote: {
    fontSize: 13,
    color: Colors.darkerGray,
    paddingTop: 3,
    width: "100%",
  },
};
