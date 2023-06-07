import { Modal, Select } from "antd";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import ArrowDownIcon from "src/assets/arrowDownBlack.png";
import TrashIcon from "src/assets/redTrash.png";
import { useFetchFunnels } from "src/redux/actionIndex";
import { getOrganization } from "src/redux/organization/selector";
import { useFlattenedFolders } from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";

type Props = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
};

export const CreateNewFunnel = ({
  isModalVisible,
  setIsModalVisible,
}: Props) => {
  const flattenedFolders = useFlattenedFolders(undefined, true);
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch } = useFetchFunnels();
  const [funnelToChannel, setFunnelToChannel] = useState<string>("");
  const [folderPaths, setFolderPaths] = useState<(string | null)[]>([
    null,
    null,
  ]);

  const _handleFolderPathChange = (value: string, index: number) => {
    let arrCopy = folderPaths.slice();
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
      if (_.uniq(folderPaths).length !== folderPaths.length) {
        throw new Error(
          "All of the folder paths in your funnel must be unique."
        );
      }
      setIsLoading(true);
      await Api.organization.createFunnel(
        organization!._id.toString(),
        folderPaths as string[],
        funnelToChannel
      );
      await fetch();
      setFunnelToChannel("");
      setFolderPaths([null, null]);
      setIsModalVisible(false);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _addStep = () => {
    setFolderPaths(folderPaths.concat([null]));
  };

  const flattenedFoldersMapped = useMemo(() => {
    return flattenedFolders.map((folder) => ({
      value: folder.fullPath,
      label: folder.fullPath,
    }));
  }, [flattenedFolders.length]);

  return (
    <Modal
      onCancel={() => setIsModalVisible(false)}
      open={isModalVisible}
      okButtonProps={{ disabled: isLoading }}
      okText={isLoading ? "Saving..." : "Save"}
      onOk={_handleCreateFunnel}
      width={700}
    >
      <div style={styles.container}>
        <label style={styles.title}>Choose the funnel steps</label>
        <label style={styles.desc}>
          If logs with the same reference ID pass through the channels below
          from top to bottom, a new log will be sent to an output channel you
          specify. The funnel will be executed a maximum of once per reference
          ID.
        </label>
        {folderPaths.map((folderPath, index) => (
          <>
            {index ? (
              <img src={ArrowDownIcon} style={styles.arrowDown} />
            ) : null}
            <div style={styles.folderPathItem}>
              <Select
                showSearch
                placeholder="Select a channel"
                optionFilterProp="children"
                onChange={(val) => _handleFolderPathChange(val, index)}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={flattenedFoldersMapped}
                disabled={isLoading}
                value={folderPath}
                style={{ minWidth: 230 }}
              />
              {folderPaths.length > 2 && (
                <button
                  onClick={() => _handleDeleteFolderPath(index)}
                  disabled={isLoading}
                  style={styles.deleteBtn}
                >
                  <img src={TrashIcon} style={styles.trashIcon} />
                </button>
              )}
            </div>
          </>
        ))}
        <button
          style={styles.addStepBtn}
          onClick={_addStep}
          disabled={isLoading}
        >
          Add step to funnel
        </button>
        <hr style={styles.hr} />
        <label style={styles.title}>Specify an output channel</label>
        <label style={styles.desc}>
          If this channel doesn't exist yet, we'll automatically create it for
          you when the first log in it is created.
        </label>
        <input
          value={funnelToChannel}
          onChange={(e) => setFunnelToChannel(e.target.value)}
          style={styles.input}
          placeholder="/channel-name"
          disabled={isLoading}
        />
      </div>
    </Modal>
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
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 500,
    paddingBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: Colors.darkerGray,
    paddingBottom: 20,
    width: "100%",
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
    width: 25,
    height: 25,
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
    fontSize: 16,
    fontWeight: 500,
    width: "100%",
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 30,
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
  addStepBtn: {
    color: Colors.darkGray,
    borderRadius: 30,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.darkGray,
    outline: "none",
    backgroundColor: Colors.white,
    cursor: "pointer",
    marginTop: 20,
    fontSize: 13,
  },
  trashIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
};
