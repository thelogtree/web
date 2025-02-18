import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { useCurrentIntegration } from "../lib";

type Props = {
  numLogsText?: string;
};

export const TopOfSearch = ({ numLogsText }: Props) => {
  const { currentIntegrationFromMap } = useCurrentIntegration();
  return (
    <div style={styles.container}>
      <label style={styles.title}>
        {currentIntegrationFromMap?.prettyName} logs
      </label>
      <label style={styles.desc}>
        Enter a user's email address above to search for their{" "}
        {currentIntegrationFromMap?.prettyName} logs
      </label>
      {numLogsText ? (
        <label style={styles.numLogsTotalText}>{numLogsText}</label>
      ) : null}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 20,
    paddingTop: 60,
  },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 30,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: Colors.white,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  desc: {
    paddingBottom: 0,
    color: Colors.darkGray,
    fontSize: 18,
    paddingTop: 14,
  },
  numLogsTotalText: {
    paddingBottom: 0,
    color: Colors.gray,
    fontSize: 13,
    paddingTop: 30,
  },
  title: {
    fontWeight: 600,
    fontSize: 40,
    textAlign: "left",
    paddingRight: 6,
    color: Colors.black,
  },
  chooseFilter: {
    color: Colors.gray,
    paddingLeft: 12,
    fontSize: 13,
  },
};
