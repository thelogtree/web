import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useFindFrontendFolderFromUrl } from "../lib";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import ClockIcon from "src/assets/clock.png";

const { RangePicker } = DatePicker;

type Props = {
  doesQueryExist: boolean;
  freshQueryAndReset: (
    shouldEmptyQuery?: boolean,
    overrideFloorDate?: Date,
    overrideCeilingDate?: Date,
    shouldResetFloorDate?: boolean
  ) => Promise<void>;
};

export const DateFilter = ({ doesQueryExist, freshQueryAndReset }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const currentFolder = useFindFrontendFolderFromUrl();
  const [currentFolderId, setCurrentFolderId] = useState<string>("");
  const foldersMatch = (currentFolder?._id || "") === currentFolderId;

  const _onChange = (value: any | null) => {
    const value1Exists = value?.length >= 1 && value[0];
    const value2Exists = value?.length >= 2 && value[1];
    let floorDate: Date | undefined;
    let ceilingDate: Date | undefined;
    if (value1Exists) {
      floorDate = dayjs(value[0]).toDate();
    }
    if (value2Exists) {
      ceilingDate = dayjs(value[1]).toDate();
    }

    // we say 'false' for resetting the query because we don't support
    // filtering dates on search results yet.
    freshQueryAndReset(false, floorDate, ceilingDate, !floorDate);
  };

  useEffect(() => {
    setIsVisible(false);
    setCurrentFolderId(currentFolder?._id || "");
  }, [currentFolder?._id]);

  return doesQueryExist ? null : isVisible && foldersMatch ? (
    <div style={styles.container}>
      <label style={styles.filterLbl}>Filter by date</label>
      <RangePicker
        showTime={{ format: "hh:mm A" }}
        format="YYYY-MM-DD hh:mm A"
        onChange={_onChange}
        allowClear
        style={styles.picker}
      />
    </div>
  ) : (
    <button style={styles.filterBtn} onClick={() => setIsVisible(true)}>
      <img src={ClockIcon} style={styles.icon} />
      <label style={styles.applyFilterLbl}>Filter by date</label>
    </button>
  );
};

const styles: StylesType = {
  picker: {
    minWidth: 420,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  filterLbl: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: 300,
    paddingBottom: 10,
    letterSpacing: 0.8,
  },
  filterBtn: {
    border: "none",
    backgroundColor: Colors.transparent,
    outline: "none",
    cursor: "pointer",
    minWidth: 120,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  applyFilterLbl: {
    cursor: "pointer",
    color: Colors.gray,
    fontSize: 13,
    letterSpacing: 0.8,
  },
  icon: {
    cursor: "pointer",
    width: 16,
    height: 16,
    marginRight: 6,
  },
};
