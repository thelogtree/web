import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useFindFrontendFolderFromUrl } from "../lib";
import { StylesType } from "src/utils/styles";

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
    setCurrentFolderId(currentFolder?._id || "");
  }, [currentFolder?._id]);

  return doesQueryExist || !foldersMatch ? null : (
    <RangePicker
      showTime={{ format: "hh:mm A" }}
      format="YYYY-MM-DD hh:mm A"
      onChange={_onChange}
      allowClear
      style={styles.picker}
    />
  );
};

const styles: StylesType = {
  picker: {
    minWidth: 420,
  },
};
