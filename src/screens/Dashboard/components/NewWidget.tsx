import React, { EventHandler, useMemo, useState } from "react";
import {
  NewFrontendWidget,
  getAdjustedPositionAndSizeOfWidget,
  useCurrentDashboard,
  useDragWidget,
} from "../lib";
import { SharedStyles, StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { Select } from "antd";
import { useFlattenedFolders } from "src/screens/Logs/lib";
import { showGenericErrorAlert } from "src/utils/helpers";
import { Api } from "src/api";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { FolderType } from "logtree-types";
import { useFetchWidgetsWithData } from "src/redux/actionIndex";
import "../NewWidget.css";

type Props = {
  newWidgets: NewFrontendWidget[];
  indexInArr: number;
  setNewWidgets: (newWidgets: NewFrontendWidget[]) => void;
};

export const NewWidget = ({ newWidgets, indexInArr, setNewWidgets }: Props) => {
  const organization = useSelector(getOrganization);
  const flattenedFolders = useFlattenedFolders(undefined, true);
  const newWidget = newWidgets[indexInArr];
  const adjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    newWidget.position,
    newWidget.size
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const currentDashboard = useCurrentDashboard(true);
  const { fetch } = useFetchWidgetsWithData();
  const canSave =
    !isCreating &&
    Boolean(
      newWidget.title &&
        newWidget.type &&
        newWidget.folderPaths.length &&
        !newWidget.folderPaths.find((path) => !path)
    );

  const _handleFolderPathChange = (value: string, index: number) => {
    const newFolderPaths = newWidget.folderPaths.slice();
    newFolderPaths[index] = value;
    const newWidgetTemp = {
      ...newWidget,
      folderPaths: newFolderPaths,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    setNewWidgets(newWidgetsTemp);
  };

  const _handleTitleChange = (newText: string) => {
    const newWidgetTemp = {
      ...newWidget,
      title: newText,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    setNewWidgets(newWidgetsTemp);
  };

  const _handleQueryChange = (newText: string) => {
    const newWidgetTemp = {
      ...newWidget,
      query: newText,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    setNewWidgets(newWidgetsTemp);
  };

  const _onSave = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      if (!canSave) {
        return;
      }
      setIsCreating(true);
      const hydratedFolderPaths = newWidget.folderPaths.map(
        (path) =>
          ({
            fullPath: path,
            overrideEventName: null,
          } as FolderType)
      );
      await Api.organization.createWidget(
        organization!._id.toString(),
        currentDashboard!._id.toString(),
        newWidget.title,
        newWidget.type,
        hydratedFolderPaths,
        newWidget.position,
        newWidget.size,
        newWidget.query
      );
      await fetch();
      const newWidgetsTemp = newWidgets.filter((_, i) => i !== indexInArr);
      setNewWidgets(newWidgetsTemp);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsCreating(false);
  };

  const _onDiscard = () => {
    const newWidgetsTemp = newWidgets.filter((_, i) => i !== indexInArr);
    setNewWidgets(newWidgetsTemp);
  };

  const flattenedFoldersMapped = useMemo(() => {
    return flattenedFolders.map((folder) => ({
      value: folder.fullPath,
      label: folder.fullPath,
    }));
  }, [flattenedFolders.length]);

  return (
    <div
      style={{
        ...styles.container,
        ...adjustedPositionAndSize,
      }}
    >
      <input
        value={newWidget.title}
        onChange={(e) => _handleTitleChange(e.target.value)}
        placeholder="Title"
        style={styles.titleInput}
      />
      {newWidget.folderPaths.map((folderPath, index) => (
        <Select
          key={index}
          showSearch
          placeholder="Select a channel"
          optionFilterProp="children"
          onChange={(val) => _handleFolderPathChange(val, index)}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={flattenedFoldersMapped}
          disabled={isCreating}
          value={folderPath}
          style={styles.selectStyle}
        />
      ))}
      <label style={styles.queryLbl}>
        Optionally, only show events that have a specific word or phrase
      </label>
      <input
        value={newWidget.query || ""}
        onChange={(e) => _handleQueryChange(e.target.value)}
        placeholder="Query"
        style={styles.queryInput}
      />
      <button style={styles.discardBtn} onClick={_onDiscard}>
        Discard
      </button>
      <button
        style={{
          ...styles.saveBtn,
          ...(!canSave && SharedStyles.loadingButton),
        }}
        onClick={_onSave}
        disabled={!canSave}
      >
        {isCreating ? "Generating..." : "Generate"}
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
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#A5A5A5",
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    position: "absolute",
    zIndex: 11,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 500,
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
  },
  folderPathItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  selectStyle: {
    width: "80%",
    maxWidth: 250,
    textAlign: "left",
    color: Colors.darkGray,
  },
  queryLbl: {
    color: Colors.darkerGray,
    fontSize: 13,
    paddingTop: 12,
  },
  queryInput: {
    fontSize: 14,
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
  },
  saveBtn: {
    width: "100%",
    height: 35,
    backgroundColor: Colors.black,
    color: Colors.white,
    marginTop: 5,
    outline: "none",
    border: "none",
    cursor: "pointer",
    borderRadius: 10,
  },
  discardBtn: {
    width: "100%",
    backgroundColor: Colors.transparent,
    color: Colors.red,
    marginTop: 15,
    outline: "none",
    border: "none",
    cursor: "pointer",
  },
};
