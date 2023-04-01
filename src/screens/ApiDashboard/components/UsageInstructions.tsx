import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { PROD_SERVER_URL, serverSlug } from "src/utils/axios";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const UsageInstructions = () => {
  const organization = useSelector(getOrganization);
  return (
    <div style={styles.container}>
      <label style={styles.yourKeysSectionTitle}>USAGE INSTRUCTIONS</label>
      <label style={styles.title}>
        To send a log to Logtree, make an HTTP request that looks like this:
      </label>
      <pre style={styles.preStyle}>
        <div style={styles.codeExample}>
          {`axios.post("${PROD_SERVER_URL}${serverSlug}/v1/logs",\n  {\n    content: string; // what you want to log\n    folderPath: string; // where you want to log it in logtree. e.g. "/transactions"\n    referenceId?: string; // (optional) refers to an ID in your database (like a userID)\n  },\n  {\n    headers: {\n      "x-logtree-key": "${organization?.keys.publishableApiKey}", // this is your publishable api key\n      "authorization": "your_secret_key"\n    }\n  }\n)`}
        </div>
      </pre>
      <label style={styles.canUseAnyLanguage}>
        If the folderPath you specify does not exist yet, Logtree will
        automatically create it once the first log is sent to that folderPath.
        The example above is in Javascript, but you can use any programming
        language to call this endpoint.
      </label>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 25,
    borderRadius: 8,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    position: "relative",
    marginTop: 50,
  },
  yourKeysSectionTitle: {
    fontWeight: 300,
    backgroundColor: Colors.white,
    color: Colors.darkGray,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    position: "absolute",
    top: -15,
    left: 18,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    letterSpacing: 1,
  },
  title: {
    paddingBottom: 15,
  },
  codeExample: {
    color: Colors.white,
    fontSize: 13,
  },
  canUseAnyLanguage: {
    paddingTop: 5,
    fontSize: 14,
    color: Colors.darkGray,
  },
  preStyle: {
    backgroundColor: Colors.black,
    padding: 15,
    borderRadius: 4,
  },
};
