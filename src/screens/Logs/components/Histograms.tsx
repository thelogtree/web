import React, { useEffect, useMemo, useState } from "react";
import { HistogramItem, StatHistogram } from "./HistogramItem";
import { StylesType } from "src/utils/styles";
import { Col, Grid } from "react-flexbox-grid";
import { Row, Switch } from "antd";
import { useFindFrontendFolderFromUrl } from "../lib";
import CaretDownIcon from "src/assets/caretDownGray.png";
import CaretUpIcon from "src/assets/caretUpGray.png";
import { Colors } from "src/utils/colors";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";

type Props = {
  histograms: StatHistogram[];
  moreHistogramsAreNotShown: boolean;
  isHistogramByReferenceId: boolean;
  setIsHistogramByReferenceId: (isByReferenceId: boolean) => void;
  isLoading: boolean;
  is24HourTimeframe: boolean;
  switchTimeInterval: () => void;
  firstLogId?: string;
};

const PREVIEW_AMOUNT = 2;

export const Histograms = ({
  histograms,
  moreHistogramsAreNotShown,
  isHistogramByReferenceId,
  setIsHistogramByReferenceId,
  isLoading,
  is24HourTimeframe,
  switchTimeInterval,
  firstLogId,
}: Props) => {
  const organization = useSelector(getOrganization);
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
  }, [
    histograms.length,
    frontendFolder?._id,
    isViewingAll,
    is24HourTimeframe,
    isHistogramByReferenceId,
    isLoading,
  ]);

  return (
    <div style={styles.outerContainer}>
      <div style={styles.header}>
        {histogramsToShow.length ? (
          <label style={styles.histogramsLbl}>
            Our AI analyst made some{" "}
            {histogramsToShow[0].separateByKeywords ? "keyword " : ""}graphs for
            you 🪄
          </label>
        ) : null}
        {moreThanPreviewExist && histogramsToShow.length ? (
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
              {isViewingAll ? "Minimize" : "See more"}
            </label>
          </button>
        ) : null}
        <Switch
          onChange={() =>
            setIsHistogramByReferenceId(!isHistogramByReferenceId)
          }
          checked={isHistogramByReferenceId}
          checkedChildren="Visualizing by reference ID"
          unCheckedChildren="Visualizing by event content"
          style={{
            textAlign: "left",
            marginLeft: 10,
            backgroundColor: isHistogramByReferenceId
              ? Colors.pink500
              : Colors.gray,
          }}
          disabled={isLoading}
        />
        <Switch
          onChange={switchTimeInterval}
          checked={!is24HourTimeframe}
          checkedChildren={`Showing last ${organization?.logRetentionInDays} days`}
          unCheckedChildren="Showing last 24 hours"
          style={{
            textAlign: "left",
            marginLeft: 10,
            backgroundColor: is24HourTimeframe ? Colors.gray : Colors.pink500,
          }}
          disabled={isLoading}
        />
      </div>
      {histogramsToShow.length && !isLoading ? (
        <>
          <Grid style={styles.container}>
            <Row>
              {histogramsToShow.map((histogram, i) => (
                <Col xs={6} key={`${histogram.contentKey}_${i}`}>
                  <HistogramItem
                    histogram={histogram}
                    isVisualizingByReferenceId={isHistogramByReferenceId}
                    firstLogId={firstLogId}
                  />
                </Col>
              ))}
            </Row>
          </Grid>
          {isViewingAll && moreHistogramsAreNotShown ? (
            <label style={styles.onlySomeShownLbl}>
              Only the {histograms.length} most recently active histograms are
              shown.
            </label>
          ) : null}
        </>
      ) : (
        <label style={styles.noResults}>
          {isLoading
            ? "Looking..."
            : "Nothing interesting to show. Try switching the toggles above."}
        </label>
      )}
    </div>
  );
};

const styles: StylesType = {
  container: {
    width: "100%",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
  },
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 5,
    backgroundColor: Colors.pink100,
    borderRadius: 4,
    marginBottom: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: Colors.pink200,
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
    fontSize: 15,
    fontWeight: 500,
    paddingLeft: 15,
    paddingRight: 6,
    color: Colors.black,
  },
  onlySomeShownLbl: {
    fontSize: 12,
    color: Colors.darkerGray,
    fontWeight: 300,
    width: "100%",
    paddingBottom: 15,
    paddingLeft: 20,
  },
  noResults: {
    width: "100%",
    fontSize: 13,
    fontWeight: 400,
    color: Colors.darkerGray,
    paddingLeft: 18,
    paddingBottom: 12,
    paddingTop: 5,
  },
};
