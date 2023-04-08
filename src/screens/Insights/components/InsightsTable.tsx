import React from "react";
import { Insight } from "../lib";
import { Col, Grid, Row } from "react-flexbox-grid";
import { InsightItem } from "./InsightItem";
import { StylesType } from "src/utils/styles";

type Props = {
  insights: Insight[];
  shouldHideTitle: boolean;
};

export const InsightsTable = ({ insights, shouldHideTitle }: Props) => {
  if (!insights.length) {
    return null;
  }

  return (
    <div style={styles.outerContainer}>
      {shouldHideTitle ? null : (
        <label style={styles.title}>Other trends</label>
      )}
      <Grid style={styles.container}>
        <Row>
          {insights.map((insight) => (
            <Col xs={6}>
              <InsightItem insight={insight} />
            </Col>
          ))}
        </Row>
      </Grid>
    </div>
  );
};

const styles: StylesType = {
  container: {
    width: "100%",
    paddingTop: 10,
  },
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
    textAlign: "left",
    width: "100%",
    paddingBottom: 20,
  },
};
