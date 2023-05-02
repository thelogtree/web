import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import LogtreeIcon from "src/assets/logtreeLogo192.png";
import { useHistory } from "react-router-dom";
import "./index.css";
import { isMobile } from "react-device-detect";
import QuickArrowRight from "src/assets/quickArrowRight.png";
import ExampleGraphic from "src/assets/exampleGraphic.png";
import MessageIcon from "src/assets/message.png";
import SearchIcon from "src/assets/searchBig.png";
import SupportPersonIcon from "src/assets/supportPerson.png";
import JourneyIcon from "src/assets/journey.png";
import { Col, Grid, Row } from "react-flexbox-grid";

export const LandingPage = () => {
  const history = useHistory();
  return (
    <div style={styles.container}>
      <div style={styles.fullBackgroundColor} />
      {/* <div style={styles.backgroundColor} /> */}
      <div style={styles.topHalf}>
        <div style={styles.header}>
          <div style={styles.logtree}>
            <img src={LogtreeIcon} style={styles.logtreeIcon} />
            <label style={styles.logtreeText}>Logtree</label>
          </div>
          <button
            style={styles.signIn}
            onClick={() => history.push("/sign-in")}
            className="signInBtn"
          >
            Sign in
          </button>
        </div>
        {isMobile ? (
          <>
            <label style={styles.mainText}>
              The logging API designed to be your support engineer.
            </label>
            <label style={styles.subtitle}>
              One endpoint. No more digging through a mess of logs trying to
              figure out what went wrong.
            </label>
            <button style={styles.joinBeta} className="joinBeta">
              <label style={styles.joinBetaLbl}>Join the waitlist</label>
              <img src={QuickArrowRight} style={styles.arrowRight} />
            </button>
            <div style={styles.exampleContainer}>
              <img src={ExampleGraphic} style={styles.exampleGraphic} />
            </div>
            <label style={styles.gridTitle}>
              Organized like Slack, durable like Datadog.
            </label>
            <Grid style={styles.gridContainer}>
              <Col style={styles.statItem}>
                <label style={styles.statTitle}>100x</label>
                <label style={styles.statDesc}>
                  Rate limit compared to Slack webhooks
                </label>
              </Col>
              <Col style={styles.statItem}>
                <label style={styles.statTitle}>↑↓</label>
                <label style={styles.statDesc}>Automatic trend discovery</label>
              </Col>
              <Col style={styles.statItem}>
                <img src={MessageIcon} style={styles.statIcon} />
                <label style={styles.statDesc}>
                  Configure SMS and email alerts
                </label>
              </Col>
              <Col style={styles.statItem}>
                <img src={SearchIcon} style={styles.statIcon} />
                <label style={styles.statDesc}>
                  Search for logs across all your channels
                </label>
              </Col>
              <Col style={styles.statItem}>
                <img src={JourneyIcon} style={styles.statIcon} />
                <label style={styles.statDesc}>
                  Trace a user's journey to see what went wrong
                </label>
              </Col>
              <Col style={styles.statItem}>
                <img src={SupportPersonIcon} style={styles.statIcon} />
                <label style={styles.statDesc}>Built for everyone</label>
              </Col>
            </Grid>
          </>
        ) : (
          <>
            <div style={styles.sideBySide}>
              <div style={styles.leftSide}>
                <label style={styles.mainText}>
                  The logging API designed to be your support engineer.
                </label>
                <label style={styles.subtitle}>
                  One endpoint. No more digging through a mess of logs trying to
                  figure out what went wrong.
                </label>
                <button style={styles.joinBeta} className="joinBeta">
                  <label style={styles.joinBetaLbl}>Join the waitlist</label>
                  <img src={QuickArrowRight} style={styles.arrowRight} />
                </button>
              </div>
              <div style={styles.exampleContainer}>
                <img src={ExampleGraphic} style={styles.exampleGraphic} />
              </div>
            </div>
            <label style={styles.gridTitle}>
              Organized like Slack, durable like Datadog.
            </label>
            <Grid style={styles.gridContainer}>
              <Row style={styles.statsHorizontalContainer}>
                <Col style={{ ...styles.statItem, marginLeft: 0 }}>
                  <label style={styles.statTitle}>100x</label>
                  <label style={styles.statDesc}>
                    Rate limit compared to Slack webhooks
                  </label>
                </Col>
                <Col style={styles.statItem}>
                  <label style={styles.statTitle}>↑↓</label>
                  <label style={styles.statDesc}>
                    Automatic trend discovery
                  </label>
                </Col>
                <Col style={styles.statItem}>
                  <img src={MessageIcon} style={styles.statIcon} />
                  <label style={styles.statDesc}>
                    Configure SMS and email alerts
                  </label>
                </Col>
              </Row>
              <Row style={styles.statsHorizontalContainer}>
                <Col style={{ ...styles.statItem, marginLeft: 0 }}>
                  <img src={SearchIcon} style={styles.statIcon} />
                  <label style={styles.statDesc}>
                    Search for logs across all your channels
                  </label>
                </Col>
                <Col style={styles.statItem}>
                  <img src={JourneyIcon} style={styles.statIcon} />
                  <label style={styles.statDesc}>
                    Trace a user's journey to see what went wrong
                  </label>
                </Col>
                <Col style={styles.statItem}>
                  <img src={SupportPersonIcon} style={styles.statIcon} />
                  <label style={styles.statDesc}>Built for everyone</label>
                </Col>
              </Row>
            </Grid>
          </>
        )}
      </div>
      <div style={styles.footer}>
        <label style={styles.copyright}>© 2023 Logtree, LLC</label>
      </div>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingLeft: isMobile ? 20 : 100,
    paddingRight: isMobile ? 20 : 100,
    paddingBottom: 10,
    overflowY: "auto",
    position: "relative",
    zIndex: 3,
  },
  backgroundColor: {
    backgroundColor: Colors.white,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  fullBackgroundColor: {
    backgroundColor: Colors.white, // Colors.black,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },
  topHalf: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.transparent,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingBottom: 150,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    width: "100%",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: isMobile ? "center" : "flex-end",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  logtree: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logtreeIcon: {
    width: 30,
    height: 30,
  },
  logtreeText: {
    paddingLeft: 6,
    fontSize: 20,
    fontWeight: 500,
  },
  signIn: {
    outline: "none",
    cursor: "pointer",
    // boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    border: "none",
    borderStyle: "solid",
    borderColor: Colors.gray,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    color: Colors.black,
    fontWeight: 500,
    fontSize: 14,
  },
  mainText: {
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    textAlign: isMobile ? "center" : "left",
    paddingTop: isMobile ? 70 : 0,
  },
  gridTitle: {
    fontWeight: 700,
    fontSize: isMobile ? 25 : 32,
    paddingTop: isMobile ? `calc(100vh - 630px)` : `calc(100vh - 600px)`,
    textAlign: "center",
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: isMobile ? 15 : 17,
    color: Colors.darkerGray,
    paddingTop: isMobile ? 15 : 12,
    textAlign: isMobile ? "center" : "left",
    lineHeight: 1.4,
    fontWeight: 300,
    width: "85%",
  },
  exampleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 4,
    maxWidth: isMobile ? "90%" : 600,
    marginTop: isMobile ? 60 : 0,
  },
  exampleGraphic: {
    width: "100%",
  },
  joinBeta: {
    outline: "none",
    cursor: "pointer",
    color: Colors.white,
    borderRadius: 30,
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 10,
    paddingBottom: 10,
    border: "none",
    marginTop: isMobile ? 30 : 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  joinBetaLbl: {
    color: Colors.white,
    cursor: "pointer",
    fontSize: 14,
  },
  arrowRight: {
    width: 20,
    height: 20,
    cursor: "pointer",
    marginLeft: 3,
  },
  copyright: {
    color: Colors.gray,
    fontSize: 11,
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 3,
    paddingRight: 100,
    maxWidth: 800,
  },
  sideBySide: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 180,
  },
  statsHorizontalContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    width: "100%",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: isMobile ? "100%" : 340,
    marginLeft: isMobile ? 0 : 30,
    height: 150,
    marginTop: isMobile ? 30 : 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  statTitle: {
    fontSize: 50,
    textAlign: "center",
    fontWeight: 300,
  },
  statDesc: {
    paddingTop: 20,
    fontSize: 14,
    textAlign: "center",
    fontWeight: 300,
    color: Colors.darkerGray,
  },
  statIcon: {
    width: 50,
    height: 50,
  },
  gridContainer: {
    paddingTop: isMobile ? 0 : 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...(isMobile && { width: "100%" }),
  },
};
