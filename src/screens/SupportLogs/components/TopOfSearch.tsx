import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  query: string;
  setQuery: (newQuery: string) => void;
  isLoading: boolean;
};

export const TopOfSearch = ({ query, setQuery, isLoading }: Props) => {
  const organization = useSelector(getOrganization);

  if (!organization) {
    return null;
  }

  return (
    <div style={styles.container}>
      <label style={styles.title}>Search for a user's activity</label>
      <div style={styles.inputContainer}>
        <input
          style={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a user's email"
        />
      </div>
      {/* {numLogsText ? (
        <label
          style={{
            ...styles.numLogsTotalText,
            ...(!isLoading && styles.numLogsTotalTextAtResults),
          }}
        >
          {numLogsText}
        </label>
      ) : null} */}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingBottom: 40,
    paddingTop: 100,
  },
  filterContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: 600,
    borderRadius: 16,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lighterGray,
    padding: 20,
    marginTop: 25,
    backgroundColor: Colors.white,
    position: "relative",
    // boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  numLogsTotalText: {
    paddingBottom: 0,
    color: Colors.gray,
    fontSize: 14,
    paddingTop: 24,
    textAlign: "start",
    width: "100%",
    paddingLeft: 5,
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
    textAlign: "start",
    color: Colors.black,
    paddingBottom: 22,
  },
  searchInput: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lighterGray,
    paddingRight: 20,
    borderRadius: 16,
    minHeight: 35,
    width: "100%",
    maxWidth: 600,
    paddingLeft: 25,
    fontSize: 16,
    zIndex: 10,
    height: "100%",
    // boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  questionInput: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lighterGray,
    padding: 20,
    borderRadius: 16,
    minHeight: 35,
    width: "100%",
    maxWidth: 600,
    paddingLeft: 25,
    fontSize: 16,
    zIndex: 10,
  },
  select: {
    marginTop: 14,
  },
  moreFiltersLbl: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.gray,
    backgroundColor: Colors.white,
    paddingLeft: 6,
    paddingRight: 6,
    position: "absolute",
    top: -8,
    left: 20,
  },
  keywordInput: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    paddingLeft: 14,
    fontSize: 14,
  },
  desc: {
    color: Colors.gray,
    paddingBottom: 25,
    fontSize: 14,
    maxWidth: 600,
    lineHeight: 1.4,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    height: 1,
    border: "none",
    marginTop: 32,
  },
  numLogsTotalTextAtResults: {
    color: Colors.gray,
    fontSize: 15,
    fontWeight: 500,
  },
  addFiltersBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    color: Colors.gray,
    textDecoration: "underline",
    backgroundColor: Colors.transparent,
    fontSize: 13,
    marginTop: 10,
  },
  askButton: {
    height: "100%",
    width: 120,
    cursor: "pointer",
    backgroundColor: Colors.black,
    color: Colors.white,
    fontWeight: 600,
    fontSize: 15,
    outline: "none",
    border: "none",
    marginLeft: 15,
    borderRadius: 16,
  },
  qaDiv: {
    paddingTop: 30,
    backgroundColor: Colors.white,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  responseContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    marginTop: 25,
    marginBottom: 25,
    backgroundColor: Colors.veryLightRed,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.red,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 60,
    width: "100%",
  },
  quickGptActionButton: {
    outline: "none",
    border: "none",
    borderRadius: 16,
    backgroundColor: Colors.black,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    marginLeft: 20,
    cursor: "pointer",
  },
  quickActionIcon: {
    width: 26,
    height: 26,
    cursor: "pointer",
  },
};
