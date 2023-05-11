import React from "react";
import { BigTextHeader } from "src/sharedComponents/BigTextHeader";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const IntercomLearnMoreScreen = () => (
  <div style={styles.outerContainer}>
    <div style={styles.container}>
      <BigTextHeader text="Learn more about our Intercom app" />
      <p style={styles.paragraph}>
        Logtree connects to Intercom to primarily do 2 things. One is to include
        your team's Intercom messages in any journeys. This means when you look
        up a user's email, you'll be able to see all of the Intercom messages
        for that user too. The second reason is to eventually send automated
        notes in an Intercom conversation with suggestions on what to say to a
        user based on what Logtree has access to in other logs and what Logtree
        thinks the error was for the user. This is meant to allow you to spend
        far less time on support. To learn more about what Logtree is, visit{" "}
        <a href="https://logtree.co" style={styles.aTag}>
          our landing page.
        </a>{" "}
        You can also{" "}
        <a href="mailto:hello@logtree.co" style={styles.aTag}>
          email us
        </a>{" "}
        if you have any questions.
      </p>
    </div>
  </div>
);

const styles: StylesType = {
  outerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 100,
  },
  container: {
    width: "90%",
    maxWidth: 1500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  paragraph: {
    fontSize: 14,
    color: Colors.darkGray,
    paddingTop: 20,
    lineHeight: 1.5,
  },
  aTag: {
    color: Colors.darkGray,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "underline",
  },
};
