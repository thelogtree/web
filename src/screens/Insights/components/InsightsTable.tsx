import React from "react";
import { Insight } from "../lib";
import { Col, Grid, Row } from "react-flexbox-grid";
import { InsightItem } from "./InsightItem";
import { StylesType } from "src/utils/styles";

type Props = {
  insights: Insight[];
};

export const InsightsTable = ({ insights }: Props) => (
  <Grid style={styles.container}>
    <Row>
      {insights.map((insight) => (
        <Col xs={6}>
          <InsightItem insight={insight} />
        </Col>
      ))}
    </Row>
  </Grid>
);

const styles: StylesType = {
  container: {
    width: "100%",
    paddingTop: 10,
  },
};
