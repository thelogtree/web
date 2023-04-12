import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import moment from "moment";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  logFrequencies: number[]; // this is per-day right now
  numLogsToday: number;
};

export const MiniGraph = ({ logFrequencies, numLogsToday }: Props) => {
  const getName = (index: number) => {
    if (index === logFrequencies.length - 1) {
      return "Last 24 hours";
    }
    const nameVal = logFrequencies.length - index - 1;
    if (nameVal === 1) {
      return "1 day ago";
    }
    return `${nameVal} days ago`;
  };

  const data = useMemo(() => {
    return logFrequencies.map((logs, index) => ({
      name: getName(index),
      logs,
    }));
  }, [logFrequencies.length]);

  if (!logFrequencies.length) {
    return null;
  }

  return (
    <div style={styles.container}>
      <label style={styles.title}>Last {logFrequencies.length} days</label>
      <label style={styles.numToday}>
        {numLogsToday
          ? `+${numLogsToday} ${numLogsToday === 1 ? "log" : "logs"} today`
          : "No logs today"}
      </label>
      <ResponsiveContainer width={130} height={40}>
        <AreaChart width={130} height={40} data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#919191" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#919191" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="logs"
            stroke={Colors.gray}
            strokeWidth={2}
            dot={false}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 15,
    color: Colors.black,
    paddingBottom: 4,
    fontWeight: 500,
  },
  numToday: {
    fontSize: 13,
    color: Colors.darkGray,
    paddingBottom: 6,
    fontWeight: 300,
  },
};
