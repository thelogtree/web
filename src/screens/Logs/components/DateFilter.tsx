import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useFindFrontendFolderFromUrl } from "../lib";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import CalendarIcon from "src/assets/calendar.png";

const { RangePicker } = DatePicker;

type Props = {
  isDateFilterOpened: boolean;
  setIsDateFilterOpened: (isOpened: boolean) => void;
  doesQueryExist: boolean;
  freshQueryAndReset: (
    shouldEmptyQuery?: boolean,
    overrideFloorDate?: Date,
    overrideCeilingDate?: Date,
    shouldResetFloorDate?: boolean
  ) => Promise<void>;
};

export const DateFilter = ({
  isDateFilterOpened,
  setIsDateFilterOpened,
  doesQueryExist,
  freshQueryAndReset,
}: Props) => {
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

  const _cancel = () => {
    setIsDateFilterOpened(false);
    _onChange(null);
  };

  useEffect(() => {
    setIsDateFilterOpened(false);
    setCurrentFolderId(currentFolder?._id || "");
  }, [currentFolder?._id]);

  return doesQueryExist ? null : isDateFilterOpened && foldersMatch ? (
    <div style={styles.container}>
      <label
        style={styles.removeFilterLbl}
        onClick={_cancel}
        className="dateFilterBtn"
      >
        Remove filter
      </label>
      <RangePicker
        showTime={{ format: "hh:mm A" }}
        format="YYYY-MM-DD hh:mm A"
        onChange={_onChange}
        allowClear
        style={styles.picker}
      />
    </div>
  ) : (
    <button
      style={styles.filterBtn}
      onClick={() => setIsDateFilterOpened(true)}
      className="dateFilterBtn"
    >
      <img src={CalendarIcon} style={styles.calendarIcon} />
      <label style={styles.applyFilterLbl}>Filter date</label>
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
  removeFilterLbl: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: 400,
    paddingBottom: 6,
    cursor: "pointer",
  },
  filterBtn: {
    border: "none",
    backgroundColor: Colors.transparent,
    outline: "none",
    cursor: "pointer",
    minWidth: 80,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    position: "relative",
    color: Colors.gray,
  },
  applyFilterLbl: {
    cursor: "pointer",
    fontSize: 13,
    marginLeft: 6,
  },
  icon: {
    cursor: "pointer",
    width: 16,
    height: 16,
    marginRight: 6,
  },
  calendarIcon: {
    width: 17,
    height: 17,
    cursor: "pointer",
  },
};
