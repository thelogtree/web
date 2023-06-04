import moment from "moment-timezone";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Colors } from "src/utils/colors";
import { shortenString } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export type StatHistogram = {
  contentKey: string;
  histogramData: {
    count: number;
    floorDate: Date;
    ceilingDate: Date;
  }[];
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload[0].value) {
    return null;
  }

  const count = payload[0].payload.count;
  const dates = payload[0].payload.date;
  return (
    <div style={styles.tooltipContainer}>
      <label style={styles.tooltipCount}>
        {count} {count === 1 ? "instance" : "instances"}
      </label>
      <label style={styles.tooltipDates}>{dates}</label>
    </div>
  );
};

type Props = {
  histogram: StatHistogram;
};

export const HistogramItem = ({ histogram }: Props) => {
  const timeAgo = moment(histogram.histogramData[0].floorDate).fromNow(true);
  const data = useMemo(() => {
    return histogram.histogramData.map((dataInterval) => ({
      date: `${moment(dataInterval.floorDate).format(
        "MM/DD/YYYY hh:mm A"
      )} to ${moment(dataInterval.ceilingDate).format("MM/DD/YYYY hh:mm A")}`,
      count: dataInterval.count,
    }));
  }, [
    histogram.histogramData.length,
    histogram.histogramData[0].floorDate.toString(),
  ]);
  const histogramTitle = shortenString(histogram.contentKey, 45);

  return (
    <div style={styles.container}>
      <label style={styles.histogramTitle}>{histogramTitle}</label>
      <label style={styles.timeAgo}>Last {timeAgo}</label>
      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={data}>
          <XAxis tick={false} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            position={{ y: 60 }}
          />
          <Bar dataKey="count" fill={Colors.black} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    width: "100%",
    height: 140,
    marginBottom: 20,
    boxShadow: "2px 2px 6px rgba(0,0,0,0.05)",
    outline: "none",
  },
  tooltipContainer: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  tooltipCount: {
    fontSize: 15,
    fontWeight: 600,
    paddingBottom: 8,
  },
  tooltipDates: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
  },
  histogramTitle: {
    fontSize: 16,
    fontWeight: 500,
    paddingBottom: 8,
  },
  timeAgo: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
    paddingBottom: 10,
  },
};
