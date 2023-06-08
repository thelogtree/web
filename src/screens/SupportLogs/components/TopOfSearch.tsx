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
  showFilters: boolean;
  keywordFilter: string;
  setKeywordFilter: (keywordFilter: string) => void;
};

export const TopOfSearch = ({
  numLogsText,
  query,
  setQuery,
  setFilteredSources,
  filterOptions,
  filteredSources,
  showFilters,
  keywordFilter,
  setKeywordFilter,
}: Props) => {
  const organization = useSelector(getOrganization);
  const filterOptionsInPicker = filterOptions.map((option) => ({
    value: option,
    label: option,
  }));

  if (!organization) {
    return null;
  }

  return (
    <div style={styles.container}>
      <label style={styles.title}>
        View a user's journey through {organization?.name}
      </label>
      <input
        style={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a user's email"
      />
      {showFilters ? (
        <div style={styles.filterContainer}>
          <label style={styles.moreFiltersLbl}>Add filters</label>
          <input
            style={styles.keywordInput}
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
            placeholder="Filter by a word or phrase"
          />
          {filterOptions.length ? (
            <Select
              mode="multiple"
              allowClear
              value={filteredSources}
              style={styles.select}
              placeholder="Filter sources"
              defaultValue={[]}
              onChange={setFilteredSources}
              options={filterOptionsInPicker}
            />
          ) : null}
        </div>
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
    paddingBottom: 70,
    paddingTop: 100,
  },
  filterContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
    width: "80%",
    maxWidth: 400,
    top: -12,
    borderRadius: 16,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 20,
    paddingTop: 30,
    backgroundColor: Colors.veryLightGray,
  },
  numLogsTotalText: {
    paddingBottom: 0,
    color: Colors.gray,
    fontSize: 13,
    paddingTop: 16,
    textAlign: "center",
    width: "100%",
  },
  title: {
    fontWeight: 500,
    fontSize: 30,
    textAlign: "center",
    color: Colors.black,
    paddingBottom: 40,
  },
  searchInput: {
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 20,
    borderRadius: 30,
    minHeight: 35,
    width: "100%",
    maxWidth: 600,
    paddingLeft: 25,
    fontSize: 16,
    zIndex: 10,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  select: {
    width: "100%",
    marginTop: 14,
  },
  moreFiltersLbl: {
    fontSize: 16,
    fontWeight: 400,
    paddingBottom: 10,
    color: Colors.darkGray,
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
};
