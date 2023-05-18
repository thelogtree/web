import { Switch } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  getIntegrations,
  getOrganization,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  numLogsText?: string;
  setShouldOnlyShowErrors: (val: boolean) => void;
  shouldOnlyShowErrors: boolean;
};

export const TopOfSearch = ({
  numLogsText,
  setShouldOnlyShowErrors,
  shouldOnlyShowErrors,
}: Props) => {
  const organization = useSelector(getOrganization);
  return (
    <div style={styles.container}>
      <label style={styles.title}>Journey Finder</label>
      <label style={styles.desc}>
        Enter a user's email address above to get their journey through{" "}
        {organization?.name}
      </label>
      {numLogsText ? (
        <label style={styles.numLogsTotalText}>{numLogsText}</label>
      ) : null}
      <div style={styles.filterContainer}>
        <Switch
          checkedChildren="Showing only errors"
          unCheckedChildren="Showing everything"
          onChange={() => setShouldOnlyShowErrors(!shouldOnlyShowErrors)}
          defaultChecked={shouldOnlyShowErrors}
          checked={shouldOnlyShowErrors}
          style={{
            backgroundColor: shouldOnlyShowErrors ? Colors.red : Colors.gray,
          }}
        />
        <label style={styles.chooseFilter}>
          Choose whether to only show errors
        </label>
      </div>
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
    fontWeight: 700,
    fontSize: 60,
    textAlign: "left",
    paddingRight: 6,
    background: "linear-gradient(268.45deg, #000000 30.54%, #424242 60.79%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  chooseFilter: {
    color: Colors.gray,
    paddingLeft: 12,
    fontSize: 13,
  },
};
