import { DatePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

const { RangePicker } = DatePicker;

type Props = {
  doesQueryExist: boolean;
  freshQueryAndReset: (
    shouldEmptyQuery?: boolean,
    overrideFloorDate?: Date,
    overrideCeilingDate?: Date
  ) => Promise<void>;
};

export const DateFilter = ({ doesQueryExist, freshQueryAndReset }: Props) => {
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
    freshQueryAndReset(false, floorDate, ceilingDate);
  };

  return doesQueryExist ? null : (
    <RangePicker
      showTime={{ format: "HH:mm" }}
      format="YYYY-MM-DD HH:mm"
      onChange={_onChange}
      allowClear
    />
  );
};
