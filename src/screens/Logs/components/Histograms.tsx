import React from "react";
import { HistogramItem, StatHistogram } from "./HistogramItem";
import { StylesType } from "src/utils/styles";
import { Col, Grid } from "react-flexbox-grid";
import { Row } from "antd";

type Props = {
  histograms: StatHistogram[];
};

export const Histograms = ({ histograms }: Props) => {
  return (
    <div style={styles.outerContainer}>
      <Grid style={styles.container}>
        <Row>
          {histograms.map((histogram) => (
            <Col xs={6}>
              <HistogramItem histogram={histogram} />
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
  },
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
};
