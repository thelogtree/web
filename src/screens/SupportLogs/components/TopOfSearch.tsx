import { Select, Switch } from "antd";
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
  setFilteredSources: (sources: string[]) => void;
  filteredSources: string[];
  filterOptions: string[];
  query: string;
  setQuery: (newQuery: string) => void;
};

export const TopOfSearch = ({
  numLogsText,
  query,
  setQuery,
  setFilteredSources,
  filterOptions,
  filteredSources,
}: Props) => {
  const organization = useSelector(getOrganization);

  const filterOptionsInPicker = filterOptions.map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <div style={styles.container}>
      <input
        style={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a user's email"
      />
      {filterOptions.length ? (
        <Select
          mode="multiple"
          allowClear
          style={styles.select}
          placeholder="Filter sources"
          defaultValue={[]}
          onChange={setFilteredSources}
          options={filterOptionsInPicker}
        />
      ) : null}
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
    alignItems: "center",
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
  numLogsTotalText: {
    paddingBottom: 0,
    color: Colors.gray,
    fontSize: 13,
    paddingTop: 30,
    textAlign: "center",
    width: "100%",
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
  searchInput: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 10,
    borderRadius: 30,
    minHeight: 35,
    width: "100%",
    maxWidth: 500,
    paddingLeft: 16,
    fontSize: 14,
  },
  select: {
    width: 450,
    marginTop: 25,
  },
};
