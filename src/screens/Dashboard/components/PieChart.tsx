import { WidgetDocument } from "logtree-types";
import moment from "moment-timezone";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { widgetTimeframes } from "../lib";
import { getColorFromIndex } from "../colorsArr";

type Props = {
  graphData: { name: string; value: number }[];
  numLogsTotal: number;
  fullPath: string;
  suffix: string;
  widget: WidgetDocument;
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload[0].value) {
    return null;
  }

  const name = payload[0].name;
  const count = payload[0].value;
  return (
    <div style={styles.tooltipContainer}>
      <label style={styles.tooltipCount}>
        {count} {count === 1 ? "instance" : "instances"}
      </label>
      <label style={styles.tooltipDates}>{name}</label>
    </div>
  );
};

export const PieChart = ({
  graphData,
  numLogsTotal,
  fullPath,
  suffix,
  widget,
}: Props) => (
  <>
    <label style={styles.description}>
      Last {widgetTimeframes[widget.timeframe!]}
    </label>
    <div style={styles.graphContainer}>
      <label style={styles.numEventsLbl}>
        {numLogsTotal} {suffix}
      </label>
      <label style={styles.fullPath}>{fullPath}</label>
      <ResponsiveContainer width="100%" height={"85%"}>
        <RechartsPieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <Pie
            data={graphData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            isAnimationActive={false}
          >
            {graphData.map((_, index) => (
              <Cell fill={getColorFromIndex(index)} />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            position={{ y: 28 }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  </>
);

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
