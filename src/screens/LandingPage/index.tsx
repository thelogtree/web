import "./index.css";

import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { Api } from "src/api";
import IntercomExampleGraphic from "src/assets/channelsGraphic.png";
import TrustIcon from "src/assets/guaranteeStamp.png";
import LogtreeIcon from "src/assets/logtreeLogo192.png";
import QuickArrowRight from "src/assets/quickArrowRight.png";
import TwitterIcon from "src/assets/twitterLogo.png";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export const LandingPage = () => {
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successfullySubmitted, setSuccessfullySubmitted] =
    useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 300);
  }, []);

  const _createAccount = async () => {
    history.push("/sign-up");
  };

  const _joinWaitlist = async () => {
    try {
      if (!email || !websiteUrl || !description) {
        setError(true);
        return;
      }
      setIsLoading(true);
      await Api.organization.addToWaitlist(email, websiteUrl, description);
      setSuccessfullySubmitted(true);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        open={isVisible}
        style={styles.modalContainer}
        onOk={_joinWaitlist}
        okText={
          isLoading
            ? "Loading..."
            : successfullySubmitted
            ? "Done!"
            : "Notify me when available"
        }
        okButtonProps={{
          ...((successfullySubmitted || isLoading) && {
            disabled: true,
            style: { cursor: "default" },
          }),
        }}
        onCancel={() => setIsVisible(false)}
        cancelButtonProps={{ hidden: true }}
        closable={false}
      >
        {successfullySubmitted ? (
          <label style={styles.addedToWaitlist}>
            We'll notify you when Logtree becomes publicly available. Be sure to
            keep an eye on your email!
          </label>
        ) : (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              type="email"
            />
            <input
              placeholder="Link to your website"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Why do you want to use Logtree?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textAreaInput}
            />
            {error && (
              <label style={styles.errorText}>
                Please fill out all the fields above.
              </label>
            )}
          </>
        )}
      </Modal>
      <div style={styles.container}>
        <div style={styles.fullBackgroundColor} />
        {/* <div style={styles.backgroundColor} /> */}
        <div style={styles.topHalf}>
          <div style={styles.header}>
            <div style={styles.logtree}>
              <img src={LogtreeIcon} style={styles.logtreeIcon} alt="icon" />
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
              <div
                style={{
                  ...styles.mobileTopContainer,
                  ...(pageLoaded && { opacity: 1 }),
                }}
              >
                <label style={styles.mainText}>
                  The events API for startups
                </label>
                <label style={styles.subtitle}>
                  The best Datadog alternative. Record errors or events, see
                  auto-generated graphs, search across all your events, and even
                  create custom dashboards.
                </label>
                <button
                  style={styles.joinBeta}
                  className="joinBeta"
                  onClick={_createAccount}
                >
                  <label style={styles.joinBetaLbl}>Create free account</label>
                  <img src={QuickArrowRight} style={styles.arrowRight} />
                </button>
                <div style={styles.trustedContainer}>
                  <label style={styles.alreadyUsedBy}>
                    Trusted by startups like Juicebox, Fizz, Awaken, and others.
                  </label>
                </div>
                <div style={styles.exampleContainer}>
                  <img
                    src={IntercomExampleGraphic}
                    style={styles.exampleGraphic1}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  ...styles.sideBySide,
                  ...(pageLoaded && { opacity: 1 }),
                }}
              >
                <div style={styles.leftSide}>
                  <label style={styles.mainText}>
                    The events API for startups
                  </label>
                  <label style={styles.subtitle}>
                    The best Datadog alternative. Record errors or events, see
                    auto-generated graphs, search across all your events, and
                    even create custom dashboards.
                  </label>
                  <div style={styles.trustedContainer}>
                    <img src={TrustIcon} style={styles.trustIcon} />
                    <label style={styles.alreadyUsedBy}>
                      Trusted by startups like Juicebox, Fizz, Awaken, and
                      others.
                    </label>
                  </div>
                  <button
                    style={styles.joinBeta}
                    className="joinBeta"
                    onClick={_createAccount}
                  >
                    <label style={styles.joinBetaLbl}>
                      Create free account
                    </label>
                    <img src={QuickArrowRight} style={styles.arrowRight} />
                  </button>
                </div>
                <div style={styles.exampleContainer}>
                  <img
                    src={IntercomExampleGraphic}
                    style={styles.exampleGraphic1}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {pageLoaded && (
          <div style={styles.footer}>
            <button
              onClick={() => window.open("mailto:hello@logtree.co", "_blank")}
              style={styles.contactUs}
              className="contactUsBtn"
            >
              Contact us
            </button>
            <button
              onClick={() =>
                window.open("https://twitter.com/uselogtree", "_blank")
              }
              style={styles.twitterBtn}
            >
              <img src={TwitterIcon} style={styles.twitterIcon} />
            </button>
            <label style={styles.copyright}>© 2023 Logtree, LLC</label>
          </div>
        )}
      </div>
    </>
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
    paddingLeft: isMobile ? 20 : "11vh",
    paddingRight: isMobile ? 20 : "11vh",
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
    paddingBottom: isMobile ? 100 : 0,
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
    fontSize: isMobile ? 30 : 38,
    textAlign: isMobile ? "center" : "left",
    paddingTop: isMobile ? 70 : 0,
  },
  mainText2: {
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    textAlign: isMobile ? "center" : "left",
    paddingTop: isMobile ? `calc(100vh - 630px)` : `calc(100vh - 600px)`,
  },
  easySetupTitle: {
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    textAlign: isMobile ? "center" : "left",
    // paddingLeft: isMobile ? 14 : 20,
  },
  sparkleIcon: {
    width: isMobile ? 35 : 50,
    height: isMobile ? 35 : 50,
  },
  easySetupContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: isMobile ? `calc(100vh - 630px)` : 230,
  },
  easySetupDesc: {
    paddingTop: 20,
    fontSize: 18,
    textAlign: "center",
    fontWeight: 300,
    color: Colors.darkerGray,
    ...(isMobile && { maxWidth: "90%" }),
  },
  gridTitle: {
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    paddingTop: isMobile ? `calc(100vh - 630px)` : 230,
    textAlign: "center",
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: isMobile ? 13 : 17,
    color: Colors.darkerGray,
    paddingTop: isMobile ? 15 : 12,
    textAlign: isMobile ? "center" : "left",
    lineHeight: 1.4,
    fontWeight: 300,
    width: isMobile ? "93%" : "85%",
  },
  exampleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 4,
    maxWidth: isMobile ? "90%" : 500,
    marginTop: isMobile ? 80 : 0,
    marginRight: isMobile ? 0 : 60,
    ...(!isMobile && { marginLeft: 40 }),
    // boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
    // padding: 50,
    // borderRadius: 16,
  },
  exampleChannelsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: isMobile ? "90%" : 500,
    marginTop: isMobile ? 60 : 0,
  },
  exampleGraphic1: {
    width: "100%",
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
  madeIn: {
    marginRight: 10,
    fontSize: 11,
    color: Colors.gray,
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxWidth: 800,
  },
  sideBySide: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "14%",
    transition: "opacity 0.4s ease-in",
    opacity: 0,
  },
  sideBySide2: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: isMobile ? 30 : 250,
  },
  statsHorizontalContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    width: "100%",
  },
  usedByHorizontalContainer: {
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
  usedByItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: isMobile ? "100%" : 200,
    marginLeft: isMobile ? 0 : 25,
    marginTop: isMobile ? 50 : 0,
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
  endingText: {
    color: Colors.darkerGray,
    paddingTop: isMobile ? 140 : 180,
    paddingBottom: 30,
    fontWeight: 300,
    fontSize: isMobile ? 17 : 20,
    textAlign: "center",
    ...(isMobile && { width: "90%" }),
  },
  andMoreIntegrations: {
    color: Colors.darkerGray,
    paddingTop: 60,
    paddingBottom: 30,
    fontWeight: 300,
    fontSize: isMobile ? 15 : 17,
    textAlign: "center",
    ...(isMobile && { width: "90%" }),
  },
  integrationDesc: {
    color: Colors.darkerGray,
    paddingBottom: isMobile ? 0 : 30,
    fontWeight: 300,
    fontSize: isMobile ? 15 : 17,
    textAlign: "center",
    ...(isMobile && { width: "90%" }),
  },
  input: {
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 15,
  },
  textAreaInput: {
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingLeft: 8,
    height: 70,
    width: "100%",
    borderWidth: 1,
    fontSize: 15,
  },
  modalContainer: {
    padding: 30,
    ...(!isMobile && {
      width: "90%",
      maxWidth: 750,
    }),
  },
  errorText: {
    paddingTop: 30,
    color: Colors.red,
  },
  madeWithLogtree: {
    marginTop: 30,
    color: Colors.green800,
    backgroundColor: Colors.green50,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    fontSize: 13,
  },
  madeWithLogtreeContainer: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
  },
  twitterIcon: {
    cursor: "pointer",
    width: 20,
    height: 16,
    filter: "grayscale(100%)",
  },
  twitterBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    marginRight: 10,
    cursor: "pointer",
  },
  contactUs: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    marginRight: 10,
    cursor: "pointer",
    color: Colors.gray,
    fontSize: 12,
  },
  usedByTitle: {
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    paddingTop: isMobile ? `calc(100vh - 630px)` : 230,
    textAlign: "center",
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    paddingBottom: isMobile ? 10 : 40,
  },
  usedByTitle2: {
    fontWeight: 700,
    fontSize: isMobile ? 25 : 38,
    paddingTop: isMobile ? `calc(100vh - 630px)` : `calc(100vh - 600px)`,
    textAlign: "center",
    background: "linear-gradient(268.45deg, #000000 30.54%, #303030 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    paddingBottom: isMobile ? 10 : 20,
  },
  vcLogo: {
    maxWidth: 200,
    maxHeight: 60,
    filter: "grayscale(100%)",
  },
  integrationLogo: {
    maxWidth: 150,
    maxHeight: 60,
  },
  mobileTopContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    transition: "opacity 0.4s ease-in",
    opacity: 0,
  },
  alreadyUsedBy: {
    fontSize: isMobile ? 11 : 14,
    color: Colors.gray,
    fontWeight: 300,
    textAlign: isMobile ? "center" : "left",
  },
  trustedContainer: {
    paddingTop: isMobile ? 34 : 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: isMobile ? "center" : "flex-start",
    alignItems: "center",
    width: isMobile ? "90%" : "100%",
  },
  trustIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
};
