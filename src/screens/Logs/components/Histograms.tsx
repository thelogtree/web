import React, { useEffect, useMemo, useState } from "react";
import { HistogramItem, StatHistogram } from "./HistogramItem";
import { StylesType } from "src/utils/styles";
import { Col, Grid } from "react-flexbox-grid";
import { Row } from "antd";
import { useFindFrontendFolderFromUrl } from "../lib";
import CaretDownIcon from "src/assets/caretDownGray.png";
import CaretUpIcon from "src/assets/caretUpGray.png";
import { Colors } from "src/utils/colors";

type Props = {
  histograms: StatHistogram[];
  moreHistogramsAreNotShown: boolean;
};

const PREVIEW_AMOUNT = 2;

export const Histograms = ({
  histograms,
  moreHistogramsAreNotShown,
}: Props) => {
  const frontendFolder = useFindFrontendFolderFromUrl();
  const [isViewingAll, setIsViewingAll] = useState<boolean>(false);
  const moreThanPreviewExist = histograms.length > PREVIEW_AMOUNT;

  useEffect(() => {
    setIsViewingAll(false);
  }, [frontendFolder?._id]);

  const histogramsToShow = useMemo(() => {
    if (isViewingAll) {
      return histograms;
    }
    return histograms.slice(0, PREVIEW_AMOUNT);
  }, [histograms.length, frontendFolder?._id, isViewingAll]);

  if (!histogramsToShow.length) {
    return null;
  }

  return (
    <div style={styles.outerContainer}>
      <div style={styles.header}>
        <label style={styles.histogramsLbl}>Histograms</label>
        {moreThanPreviewExist ? (
          <button
            onClick={() => setIsViewingAll(!isViewingAll)}
            style={styles.viewAllHistogramsBtn}
            className="viewAllHistogramsBtn"
          >
            <img
              src={isViewingAll ? CaretUpIcon : CaretDownIcon}
              style={styles.caretIcon}
            />
            <label style={styles.openCloseLbl}>
              {isViewingAll ? "Minimize" : "See all"}
            </label>
          </button>
        ) : null}
      </div>
      <Grid style={styles.container}>
        <Row>
          {histogramsToShow.map((histogram) => (
            <Col xs={6}>
              <HistogramItem histogram={histogram} />
            </Col>
          ))}
        </Row>
      </Grid>
      {isViewingAll && moreHistogramsAreNotShown ? (
        <label style={styles.onlySomeShownLbl}>
          Only the 20 most recently active histograms are shown.
        </label>
      ) : null}
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
    padding: 5,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginBottom: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
  },
  caretIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  openCloseLbl: {
    color: Colors.gray,
    marginLeft: 2,
    cursor: "pointer",
    textAlign: "left",
  },
  viewAllHistogramsBtn: {
    cursor: "pointer",
    fontSize: 13,
    letterSpacing: 0.8,
    color: Colors.gray,
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    minWidth: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingBottom: 10,
    paddingTop: 10,
  },
  histogramsLbl: {
    fontSize: 16,
    fontWeight: 500,
    paddingLeft: 18,
    paddingRight: 6,
  },
  onlySomeShownLbl: {
    fontSize: 12,
    color: Colors.darkerGray,
    fontWeight: 300,
    width: "100%",
    paddingBottom: 15,
    paddingLeft: 20,
  },
};
