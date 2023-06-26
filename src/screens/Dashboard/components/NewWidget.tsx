import "../NewWidget.css";

import { Select } from "antd";
import { FolderType, widgetTimeframe, widgetType } from "logtree-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "src/api";
import { setNewWidgets, useFetchWidgetsWithData } from "src/redux/actionIndex";
import {
  getNewWidgets,
  getOrganization,
} from "src/redux/organization/selector";
import { useFlattenedFolders } from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";

import { allowedWidgetTypes } from "../allowedWidgetTypes";
import {
  getAdjustedPositionAndSizeOfWidget,
  useCurrentDashboard,
  widgetTimeframes,
} from "../lib";
import { useResizeOrDragNewWidget } from "../useResizeOrDragNewWidget";

type Props = {
  indexInArr: number;
};

export const NewWidget = ({ indexInArr }: Props) => {
  const newWidgets = useSelector(getNewWidgets);
  const organization = useSelector(getOrganization);
  const flattenedFolders = useFlattenedFolders(undefined, true);
  const dispatch = useDispatch();
  const newWidget = newWidgets[indexInArr];
  const widgetTemplate = newWidget.type
    ? allowedWidgetTypes[newWidget.type]
    : null;
  const currentWidgetTypeAllowsQuery = !!widgetTemplate?.allowsQuery;
  const currentWidgetTypeAllowsTimeframe = !!widgetTemplate?.chooseTimeframe;
  const currentWidgetTypeRequiresUrl = !!widgetTemplate?.requiresUrl;
  const adjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    newWidget.position,
    newWidget.size
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const currentDashboard = useCurrentDashboard(true);
  const { fetch } = useFetchWidgetsWithData();
  const { onMouseDown, CornerBlocks } = useResizeOrDragNewWidget(indexInArr);
  const canSave =
    !isCreating &&
    Boolean(
      newWidget.type &&
        newWidget.title &&
        newWidget.type &&
        (!widgetTemplate?.overrideChannelsToChoose ||
        widgetTemplate.overrideChannelsToChoose.length !== 0
          ? newWidget.folderPaths.length &&
            !newWidget.folderPaths.find((path) => !path)
          : true) &&
        (widgetTemplate?.requiresUrl ? newWidget.url : true)
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
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const _handleWidgetTypeChange = (value: widgetType) => {
    const newWidgetTemp = {
      ...newWidget,
      type: value,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const _handleTimeframeChange = (value: widgetTimeframe) => {
    const newWidgetTemp = {
      ...newWidget,
      timeframe: value,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const _handleTitleChange = (newText: string) => {
    const newWidgetTemp = {
      ...newWidget,
      title: newText,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const _handleQueryChange = (newText: string) => {
    const newWidgetTemp = {
      ...newWidget,
      query: newText,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const _handleUrlChange = (newText: string) => {
    const newWidgetTemp = {
      ...newWidget,
      url: newText,
    };
    const newWidgetsTemp = newWidgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const _onSave = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      if (!canSave) {
        return;
      }
      setIsCreating(true);
      const hydratedFolderPaths = newWidget.folderPaths.map(
        (path, i) =>
          ({
            fullPath: path,
            overrideEventName: widgetTemplate?.overrideChannelsToChoose
              ? widgetTemplate.overrideChannelsToChoose[i].overrideEventName
              : null,
          } as FolderType)
      );
      const { top, left, width, height } = getAdjustedPositionAndSizeOfWidget(
        newWidget.position,
        newWidget.size
      );
      await Api.organization.createWidget(
        organization!._id.toString(),
        currentDashboard!._id.toString(),
        newWidget.title,
        newWidget.type as widgetType,
        hydratedFolderPaths,
        { x: left as number, y: top as number },
        { width: width as number, height: height as number },
        newWidget.query,
        newWidget.timeframe,
        newWidget.url
      );
      await fetch();
      const newWidgetsTemp = newWidgets.filter((_, i) => i !== indexInArr);
      dispatch(setNewWidgets(newWidgetsTemp));
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsCreating(false);
  };

  const _onDiscard = () => {
    const newWidgetsTemp = newWidgets.filter((_, i) => i !== indexInArr);
    dispatch(setNewWidgets(newWidgetsTemp));
  };

  const flattenedFoldersMapped = useMemo(() => {
    return flattenedFolders.map((folder) => ({
      value: folder.fullPath,
      label: folder.fullPath,
    }));
  }, [flattenedFolders.length]);

  const widgetTypesMapped = useMemo(() => {
    return Object.keys(allowedWidgetTypes).map((widgetType) => ({
      value: widgetType,
      label: allowedWidgetTypes[widgetType].label,
    }));
  }, []);

  const widgetTimeframesMapped = useMemo(() => {
    return Object.values(widgetTimeframe).map((timeframe) => ({
      value: timeframe,
      label: widgetTimeframes[timeframe],
    }));
  }, [widgetTimeframes]);

  useEffect(() => {
    if (widgetTemplate) {
      const newWidgetTemp = {
        ...newWidget,
        folderPaths: widgetTemplate.overrideChannelsToChoose
          ? widgetTemplate.overrideChannelsToChoose.map((_) => null)
          : [null],
      };
      const newWidgetsTemp = newWidgets.slice();
      newWidgetsTemp[indexInArr] = newWidgetTemp;
      dispatch(setNewWidgets(newWidgetsTemp));
    }
  }, [widgetTemplate?.overrideChannelsToChoose?.length]);

  return (
    <div
      style={{
        ...styles.container,
        ...adjustedPositionAndSize,
      }}
      onMouseDown={onMouseDown}
      className="newWidgetContainer"
    >
      <div style={styles.innerTop}>
        <input
          value={newWidget.title}
          onChange={(e) => _handleTitleChange(e.target.value)}
          placeholder="Add a title"
          style={styles.titleInput}
        />
        <Select
          showSearch
          placeholder="Type of widget"
          optionFilterProp="children"
          onChange={_handleWidgetTypeChange}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={widgetTypesMapped}
          disabled={isCreating}
          value={newWidget.type}
          style={styles.selectStyleWidgetType}
        />
        {newWidget.type ? (
          <>
            {newWidget.folderPaths.map((folderPath, index) => (
              <Select
                key={index}
                showSearch
                placeholder={
                  widgetTemplate?.overrideChannelsToChoose
                    ? widgetTemplate.overrideChannelsToChoose[index]
                        ?.placeholder
                    : "Select a channel"
                }
                optionFilterProp="children"
                onChange={(val) => _handleFolderPathChange(val, index)}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={flattenedFoldersMapped}
                disabled={isCreating}
                value={folderPath}
                style={{
                  ...styles.selectStyle,
                  ...(index ? { marginTop: 5 } : {}),
                }}
              />
            ))}
            {currentWidgetTypeAllowsTimeframe ? (
              <>
                <label style={styles.queryLbl}>Select a timeframe</label>
                <Select
                  placeholder="Select a timeframe"
                  optionFilterProp="children"
                  onChange={_handleTimeframeChange}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={widgetTimeframesMapped}
                  disabled={isCreating}
                  value={newWidget.timeframe}
                  style={styles.selectStyleWidgetTimeframe}
                />
              </>
            ) : null}
            {currentWidgetTypeAllowsQuery ? (
              <>
                <label style={styles.queryLbl}>
                  Optionally, only show events that have a specific word or
                  phrase
                </label>
                <input
                  value={newWidget.query || ""}
                  onChange={(e) => _handleQueryChange(e.target.value)}
                  placeholder="Query"
                  style={styles.queryInput}
                />
              </>
            ) : null}
            {currentWidgetTypeRequiresUrl ? (
              <>
                <label style={styles.queryLbl}>URL</label>
                <input
                  value={newWidget.url || ""}
                  onChange={(e) => _handleUrlChange(e.target.value)}
                  placeholder="https://some_url.com"
                  style={styles.urlInput}
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
      <div style={styles.innerBottom}>
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
      {CornerBlocks}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
  innerTop: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  innerBottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    width: "100%",
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 600,
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    marginBottom: 16,
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
    color: Colors.darkGray,
  },
  selectStyleWidgetType: {
    width: "80%",
    maxWidth: 250,
    color: Colors.darkGray,
    marginBottom: 12,
  },
  selectStyleWidgetTimeframe: {
    width: "80%",
    maxWidth: 250,
    color: Colors.darkGray,
    marginTop: 12,
  },
  queryLbl: {
    color: Colors.darkerGray,
    fontSize: 13,
    paddingTop: 20,
    paddingBottom: 6,
  },
  queryInput: {
    fontSize: 14,
    backgroundColor: Colors.transparent,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 10,
    width: "80%",
    maxWidth: 400,
    borderRadius: 10,
  },
  urlInput: {
    fontSize: 14,
    backgroundColor: Colors.transparent,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 10,
    width: "80%",
    maxWidth: 400,
    borderRadius: 10,
  },
  saveBtn: {
    width: "100%",
    height: 35,
    backgroundColor: Colors.black,
    color: Colors.white,
    marginTop: 12,
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
    fontSize: 13,
  },
};
