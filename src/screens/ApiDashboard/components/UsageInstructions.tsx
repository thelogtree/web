import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { PROD_SERVER_URL } from "src/utils/axios";
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
          {`axios.post("${PROD_SERVER_URL}/v1/logs",\n  {\n    content: string; // what you want to log\n    folderPath: string; // where you want to log it in logtree. e.g. "/transactions"\n  },\n  {\n    headers: {\n      "x-logtree-key": "${organization?.keys.publishableApiKey}" // this is your publishable api key\n      "authorization": "your_secret_key"\n    }\n  }\n)`}
        </div>
      </pre>
      <label style={styles.canUseAnyLanguage}>
        The example above is in Javascript, but you can use any programming
        language you want to call this endpoint.
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
