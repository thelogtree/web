import React from "react";
import { Insight } from "../lib";
import { StylesType } from "src/utils/styles";
import { HighPriorityInsightItem } from "./HighPriorityInsightItem";

type Props = {
  insights: Insight[];
};

export const HigherPriorityInsights = ({ insights }: Props) => {
  if (!insights.length) {
    return null;
  }

  return (
    <div style={styles.container}>
      {insights.map((insight) => (
        <HighPriorityInsightItem insight={insight} />
      ))}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingBottom: 40,
  },
};
