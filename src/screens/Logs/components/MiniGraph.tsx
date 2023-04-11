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
      <label style={styles.title}>
        Showing last {logFrequencies.length} days
      </label>
      <label style={styles.numToday}>
        {numLogsToday ? `+${numLogsToday} logs today` : "No logs today"}
      </label>
      <ResponsiveContainer width={140} height={50}>
        <LineChart width={140} height={50} data={data}>
          <Line
            type="monotone"
            dataKey="logs"
            stroke={Colors.black}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
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
    fontSize: 13,
    color: Colors.black,
    paddingBottom: 4,
    fontWeight: 500,
  },
  numToday: {
    fontSize: 12,
    color: Colors.darkGray,
    paddingBottom: 6,
    fontWeight: 300,
  },
};
