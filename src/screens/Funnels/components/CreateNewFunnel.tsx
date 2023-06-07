import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import ArrowDownIcon from "src/assets/arrowDownBlack.png";
import TrashIcon from "src/assets/redTrash.png";
import { useFetchFunnels } from "src/redux/actionIndex";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";

export const CreateNewFunnel = () => {
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch } = useFetchFunnels();
  const [funnelToChannel, setFunnelToChannel] = useState<string>("");
  const [folderPaths, setFolderPaths] = useState<string[]>(["", ""]);

  const _handleFolderPathChange = (e, index: number) => {
    const { value } = e.target;
    let arrCopy = folderPaths;
    arrCopy[index] = value;
    setFolderPaths(arrCopy);
  };

  const _handleDeleteFolderPath = (index: number) => {
    const newArr = folderPaths.filter((_, i) => i !== index);
    setFolderPaths(newArr);
  };

  const _handleCreateFunnel = async () => {
    try {
      const hasAtLeastOneFalsyValue = folderPaths.find((path) => !path);
      if (hasAtLeastOneFalsyValue) {
        throw new Error(
          `Please specify a folder path for every funnel step you have.${
            folderPaths.length > 2 ? " You can delete a step if necessary." : ""
          }`
        );
      }
      if (!funnelToChannel) {
        throw new Error("Please specify an output channel.");
      }
      if (funnelToChannel[0] !== "/" || funnelToChannel.includes(" ")) {
        throw new Error(
          `Your output channel must start with a / (e.g. "/transactions") and not contain any spaces.`
        );
      }
      setIsLoading(true);
      await Api.organization.createFunnel(
        organization!._id.toString(),
        folderPaths,
        funnelToChannel
      );
      await fetch();
      setFunnelToChannel("");
      setFolderPaths(["", ""]);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <label style={styles.title}>Specify an output channel</label>
      <label style={styles.desc}>
        This channel does not have to be already created. If it doesn't exist
        yet, we'll automatically create it when the first log in it is created.
      </label>
      <input
        value={funnelToChannel}
        onChange={(e) => setFunnelToChannel(e.target.value)}
        style={styles.input}
        placeholder="/channel-name"
        disabled={isLoading}
      />
      <hr style={styles.hr} />
      <label style={styles.title}>Choose the funnel steps</label>
      <label style={styles.desc}>
        If logs with the same reference ID pass through the channels below in
        the order of top to bottom, a new log will be sent to the output channel
        you specify above. The funnel will be executed a maximum of one time per
        reference ID.
      </label>
      {folderPaths.map((folderPath, index) => (
        <>
          {!index && <img src={ArrowDownIcon} style={styles.arrowDown} />}
          <div style={styles.folderPathItem}>
            <input
              value={folderPaths[index]}
              onChange={(e) => _handleFolderPathChange(e, index)}
              style={styles.funnelInput}
              disabled={isLoading}
            />
            {folderPaths.length > 2 && (
              <button
                onClick={() => _handleDeleteFolderPath(index)}
                disabled={isLoading}
                style={styles.deleteBtn}
              >
                <img src={TrashIcon} style={styles.icon} />
              </button>
            )}
          </div>
        </>
      ))}
      <button
        style={{
          ...styles.createBtn,
          ...(isLoading && SharedStyles.loadingButton),
        }}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  input: {
    outline: "none",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.gray,
    borderRadius: 4,
    padding: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 500,
    paddingBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: Colors.darkerGray,
    paddingBottom: 10,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    height: 1,
    border: "none",
    marginBottom: 24,
    marginTop: 20,
  },
  funnelInput: {
    outline: "none",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.gray,
    borderRadius: 4,
    padding: 8,
  },
  arrowDown: {
    width: 30,
    height: 30,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
  },
  createBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.black,
    color: Colors.white,
    fontSize: 15,
    fontWeight: 500,
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 16,
    borderRadius: 4,
  },
  deleteBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
  },
  folderPathItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
};
