import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { ZAPIER_INVITE_LINK } from "src/sharedComponents/Sidebar/components/SignedInOrganization";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const Intro = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const firstTime = !organization?.numLogsSentInPeriod;

  if (!organization) {
    return null;
  }

  return (
    <div style={styles.container}>
      <label style={styles.title}>
        {firstTime ? `Set up in 2 minutes` : "How to send events"}
      </label>
      <p style={styles.paragraph}>
        You can start sending your own events with the simple POST request
        below, or you can{" "}
        <a href={ZAPIER_INVITE_LINK} target="_blank" style={styles.zapierLink}>
          connect to Zapier
        </a>{" "}
        to get events sent to Logtree without any code.
        {/* below. You can also connect your third-party services in the{" "}
        <a
          style={styles.aTag}
          onClick={() =>
            history.push(`/org/${organization?.slug}/integrations`)
          }
          target="_self"
        >
          Connections
        </a>{" "}
        tab. */}
      </p>
      {/* <p style={styles.paragraph}>
        Once you're sending logs or have imported logs from at least one
        third-party service, you can head over to the{" "}
        <a
          style={styles.aTag}
          onClick={() => history.push(`/org/${organization?.slug}/journey`)}
          target="_parent"
        >
          Journey Finder
        </a>{" "}
        to see a chronological feed of events for a specific user. To get access
        to the AI support engineer, please email hello@logtree.co.
      </p> */}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 24,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 12,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    boxShadow: "0px 6px 16px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    paddingBottom: 16,
    color: Colors.black,
  },
  paragraph: {
    color: Colors.darkGray,
    fontWeight: 500,
    fontSize: 14,
  },
  zapierLink: {
    color: Colors.darkGray,
  },
  aTag: {
    color: Colors.darkGray,
    textDecoration: "underline",
    cursor: "pointer",
  },
};
