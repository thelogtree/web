import moment from "moment-timezone";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export type DataBox = {
  count: number;
  floorDate: Date;
  ceilingDate: Date;
};

type Props = {
  graphData: DataBox[];
  numLogsTotal: number;
  fullPath: string;
  suffix: string;
};

const CustomTooltip = ({
  active,
  payload,
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

export const Histogram = ({
  graphData,
  numLogsTotal,
  fullPath,
  suffix,
}: Props) => {
  const data = useMemo(() => {
    return graphData.map((dataInterval) => ({
      date: `${moment(dataInterval.floorDate).format(
        "MM/DD/YYYY hh:mm A"
      )} to ${moment(dataInterval.ceilingDate).format("MM/DD/YYYY hh:mm A")}`,
      count: dataInterval.count,
    }));
  }, [graphData.length, graphData[0]?.floorDate.toString()]);

  return (
    <>
      <label style={styles.description}>Last 24 hours</label>
      <div style={styles.graphContainer}>
        <label style={styles.numEventsLbl}>
          {numLogsTotal} {suffix}
        </label>
        <label style={styles.fullPath}>{fullPath}</label>
        <ResponsiveContainer width="100%" height={"85%"}>
          <BarChart
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <XAxis tick={false} stroke={Colors.blue200} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              position={{ y: 28 }}
            />
            <Bar dataKey="count" fill={Colors.blue500} barSize={110} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

const styles: StylesType = {
  graphContainer: {
    width: "100%",
    marginBottom: -10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
  },
  numEventsLbl: {
    color: Colors.blue600,
    paddingBottom: 5,
  },
  description: {
    color: Colors.gray,
    paddingTop: 6,
    paddingBottom: 12,
  },
  fullPath: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 12,
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
};
