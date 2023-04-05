import React, { useEffect, useState } from "react";
import { useFindFrontendFolderFromUrl } from "../lib";
import { useFetchFolders } from "src/redux/actionIndex";
import { Api } from "src/api";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import PencilIcon from "src/assets/pencil.png";
import "../index.css";
import { Tooltip } from "antd";

export const ChannelDescription = () => {
  const [description, setDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const folder = useFindFrontendFolderFromUrl();
  const organization = useSelector(getOrganization);
  const { fetch: refetchFolders } = useFetchFolders();

  useEffect(() => {
    setDescription(folder?.description || "");
  }, [folder?.description, folder?._id]);

  const _saveDescription = async () => {
    try {
      if (!folder || isLoading) {
        return;
      }
      setIsLoading(true);
      await Api.organization.updateFolder(
        organization!._id.toString(),
        folder._id,
        description
      );
      await refetchFolders();
      setIsEditing(false);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _toggleEditing = () => {
    setIsEditing(!isEditing);
    setDescription(folder?.description || "");
  };

  if (!folder) {
    return null;
  }

  if (isEditing) {
    return (
      <div style={styles.container}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Channel description"
          style={styles.input}
        />
        <button
          style={{
            ...styles.saveBtn,
            ...(isLoading && SharedStyles.loadingButton),
          }}
          onClick={_saveDescription}
          disabled={isLoading}
          className="buttonToPress"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          style={{
            ...styles.cancelBtn,
            ...(isLoading && SharedStyles.loadingButton),
          }}
          onClick={_toggleEditing}
          disabled={isLoading}
          className="buttonToPress"
        >
          Cancel
        </button>
      </div>
    );
  }

  return description ? (
    <div style={styles.container}>
      <Tooltip title="Click to edit description">
        <button
          style={styles.hiddenEditBtn}
          onClick={_toggleEditing}
          className="descriptionBackground"
        >
          <label style={styles.description}>{description}</label>
        </button>
      </Tooltip>
    </div>
  ) : (
    <div style={styles.container}>
      <button style={styles.toggleEditingBtn} onClick={_toggleEditing}>
        <label style={styles.addDescLbl}>Add channel description</label>
        <img src={PencilIcon} style={styles.icon} />
      </button>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 17,
  },
  input: {
    outline: "none",
    border: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 6,
    backgroundColor: Colors.white,
    minWidth: 220,
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 5,
  },
  saveBtn: {
    outline: "none",
    cursor: "pointer",
    borderRadius: 20,
    borderColor: Colors.darkGray,
    borderWidth: 1,
    borderStyle: "solid",
    marginLeft: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    boxShadow: "0px 2px 1px rgba(0,0,0,0.05)",
    color: Colors.darkGray,
    fontSize: 12,
  },
  cancelBtn: {
    outline: "none",
    cursor: "pointer",
    borderRadius: 20,
    borderColor: Colors.darkGray,
    borderWidth: 1,
    borderStyle: "solid",
    marginLeft: 6,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    boxShadow: "0px 2px 1px rgba(0,0,0,0.05)",
    color: Colors.darkGray,
    fontSize: 12,
  },
  description: {
    color: Colors.darkGray,
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 300,
  },
  icon: {
    width: 13,
    height: 13,
    cursor: "pointer",
  },
  toggleEditingBtn: {
    border: "none",
    backgroundColor: Colors.transparent,
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "left",
    outline: "none",
  },
  addDescLbl: {
    color: Colors.darkGray,
    fontSize: 11,
    textDecoration: "underline",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    right: 6,
  },
  hiddenEditBtn: {
    outline: "none",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "left",
    cursor: "pointer",
    border: "none",
    position: "relative",
    right: 5,
    backgroundColor: Colors.transparent,
  },
};
