import { WidgetDocument } from "logtree-types";
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
import { widgetTimeframes } from "../lib";
import { DataBox } from "./Histogram";

type Props = {
  graphDataSuccess: DataBox[];
  graphDataError: DataBox[];
  numLogsSuccess: number;
  numLogsError: number;
  fullPathSuccess: string;
  fullPathError: string;
  successSuffix: string;
  errorSuffix: string;
  widget: WidgetDocument;
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) {
    return null;
  }

  const successCount = payload[0].payload.successCount;
  const errorCount = payload[0].payload.errorCount;
  const dates = payload[0].payload.date;
  return (
    <div style={styles.tooltipContainer}>
      <label style={styles.tooltipCountGreen}>
        {successCount} {successCount === 1 ? "instance" : "instances"}
      </label>
      <label style={styles.tooltipCountRed}>
        {errorCount} {errorCount === 1 ? "instance" : "instances"}
      </label>
      <label style={styles.tooltipDates}>{dates}</label>
    </div>
  );
};

export const HealthMonitor = ({
  graphDataSuccess,
  graphDataError,
  numLogsSuccess,
  numLogsError,
  fullPathSuccess,
  fullPathError,
  successSuffix,
  errorSuffix,
  widget,
}: Props) => {
  const data = useMemo(() => {
    return graphDataSuccess.map((dataInterval, i) => ({
      date: `${moment(dataInterval.floorDate).format(
        "MM/DD/YYYY hh:mm A"
      )} to ${moment(dataInterval.ceilingDate).format("MM/DD/YYYY hh:mm A")}`,
      successCount: graphDataSuccess[i].count,
      errorCount: graphDataError[i].count,
    }));
  }, [graphDataSuccess.length, graphDataSuccess[0]?.floorDate.toString()]);

  return (
    <>
      <label style={styles.description}>
        Last {widgetTimeframes[widget.timeframe!]}
      </label>
      <div style={styles.graphContainer}>
        <label style={styles.numSuccessesLbl}>
          {numLogsSuccess} {successSuffix}
        </label>
        <label style={styles.numErrorsLbl}>
          {numLogsError} {errorSuffix}
        </label>
        <label style={styles.fullPathTop}>{fullPathSuccess}</label>
        <label style={styles.fullPathBottom}>{fullPathError}</label>
        <ResponsiveContainer width="100%" height={"85%"}>
          <BarChart
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            data={data}
          >
            <XAxis tick={false} stroke={Colors.lightGray} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              position={{ y: 28 }}
            />
            <Bar
              stackId="health"
              dataKey="successCount"
              fill={Colors.green500}
              barSize={110}
            />
            <Bar
              stackId="health"
              dataKey="errorCount"
              fill={Colors.red}
              barSize={110}
            />
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
  numErrorsLbl: {
    color: Colors.red,
    paddingBottom: 5,
  },
  numSuccessesLbl: {
    color: Colors.green500,
    paddingBottom: 10,
  },
  description: {
    color: Colors.gray,
    paddingTop: 6,
    paddingBottom: 12,
  },
  fullPathTop: {
    color: Colors.gray,
    fontSize: 12,
    paddingBottom: 5,
  },
  fullPathBottom: {
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
  tooltipCountGreen: {
    fontSize: 15,
    fontWeight: 600,
    paddingBottom: 4,
    color: Colors.green500,
  },
  tooltipCountRed: {
    fontSize: 15,
    fontWeight: 600,
    paddingBottom: 8,
    color: Colors.red,
  },
  tooltipDates: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
  },
};
