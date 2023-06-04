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
import { Tooltip as AntdTooltip } from "antd";
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

const MAX_CONTENT_KEY_LENGTH = 45;

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
  const histogramTitle = shortenString(
    histogram.contentKey,
    MAX_CONTENT_KEY_LENGTH
  );

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <AntdTooltip
          title={
            histogram.contentKey.length > MAX_CONTENT_KEY_LENGTH
              ? histogram.contentKey
              : ""
          }
        >
          <label style={styles.histogramTitle}>{histogramTitle}</label>
        </AntdTooltip>
        <label style={styles.timeAgo}>Last {timeAgo}</label>
      </div>
      <div style={styles.graphContainer}>
        <ResponsiveContainer width="100%" height={60}>
          <BarChart
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <XAxis tick={false} stroke={Colors.purple300} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              position={{ y: 28 }}
            />
            <Bar dataKey="count" fill={Colors.purple500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 4,
    backgroundColor: Colors.purple100,
    width: "100%",
    height: 120,
    marginBottom: 20,
    outline: "none",
  },
  top: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
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
    boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
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
    fontWeight: 400,
    paddingBottom: 4,
  },
  timeAgo: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
  },
  graphContainer: {
    width: "100%",
    marginBottom: -26,
  },
};
