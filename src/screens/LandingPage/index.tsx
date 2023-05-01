import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import LogtreeIcon from "src/assets/logtreeLogo192.png";
import { useHistory } from "react-router-dom";
import "./index.css";
import { isMobile } from "react-device-detect";
import QuickArrowRight from "src/assets/quickArrowRight.png";
import ExampleGraphic from "src/assets/exampleGraphic.png";

export const LandingPage = () => {
  const history = useHistory();
  return (
    <div style={styles.container}>
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
              The logging API designed to save you time in Intercom.
            </label>
            <label style={styles.subtitle}>
              One endpoint. No more digging through a mess of logs trying to
              figure out what went wrong.
            </label>
            <div style={styles.exampleContainer}>
              <img src={ExampleGraphic} style={styles.exampleGraphic} />
            </div>
            <button style={styles.joinBeta} className="joinBeta">
              <label style={styles.joinBetaLbl}>Join the private beta</label>
              <img src={QuickArrowRight} style={styles.arrowRight} />
            </button>
          </>
        ) : (
          <div style={styles.sideBySide}>
            <div style={styles.leftSide}>
              <label style={styles.mainText}>
                The logging API designed to save you time in Intercom.
              </label>
              <label style={styles.subtitle}>
                One endpoint. No more digging through a mess of logs trying to
                figure out what went wrong.
              </label>
              <button style={styles.joinBeta} className="joinBeta">
                <label style={styles.joinBetaLbl}>Join the private beta</label>
                <img src={QuickArrowRight} style={styles.arrowRight} />
              </button>
            </div>
            <div style={styles.exampleContainer}>
              <img src={ExampleGraphic} style={styles.exampleGraphic} />
            </div>
          </div>
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
    backgroundColor: Colors.white,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingLeft: isMobile ? 20 : 100,
    paddingRight: isMobile ? 20 : 100,
    paddingBottom: 10,
    overflowY: "auto",
  },
  topHalf: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.white,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
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
    paddingLeft: 10,
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
    borderRadius: 8,
    color: Colors.black,
    fontWeight: 500,
    fontSize: 16,
  },
  mainText: {
    background: "linear-gradient(268.45deg, #3D3D3D 30.54%, #545454 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    textAlign: isMobile ? "center" : "left",
    paddingTop: isMobile ? 50 : 0,
  },
  subtitle: {
    fontSize: isMobile ? 15 : 17,
    color: Colors.gray,
    paddingTop: isMobile ? 15 : 12,
    textAlign: isMobile ? "center" : "left",
    lineHeight: 1.4,
    fontWeight: 300,
    width: "85%",
    paddingBottom: isMobile ? 30 : 0,
  },
  exampleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 5,
    maxWidth: isMobile ? "100%" : 860,
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
    marginTop: 50,
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
};
