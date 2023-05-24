import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const Intro = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);

  if (!organization || organization.numLogsSentInPeriod) {
    return null;
  }

  return (
    <div style={styles.container}>
      <label style={styles.title}>Welcome to Logtree!</label>
      <p style={styles.paragraph}>
        You can start sending your own logs by following the integration steps
        below. You can also connect your integrations in the{" "}
        <a
          style={styles.aTag}
          onClick={() =>
            history.push(`/org/${organization?.slug}/integrations`)
          }
          target="_self"
        >
          Connections
        </a>{" "}
        tab.
      </p>
      <p style={styles.paragraph}>
        Once you're sending logs or have imported logs from at least one
        integration, you can head over to the{" "}
        <a
          style={styles.aTag}
          onClick={() => history.push(`/org/${organization?.slug}/journey`)}
          target="_parent"
        >
          Journey Finder
        </a>{" "}
        to see a chronological feed of events for a specific user. Hopefully
        this helps you debug any problems that come up with that user!
      </p>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.purple700,
    backgroundColor: Colors.purple50,
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 300,
    paddingBottom: 16,
    color: Colors.black,
  },
  paragraph: {
    color: Colors.darkGray,
    fontWeight: 300,
    letterSpacing: 0.6,
    fontSize: 16,
  },
  aTag: {
    color: Colors.darkGray,
    textDecoration: "underline",
    cursor: "pointer",
  },
};
