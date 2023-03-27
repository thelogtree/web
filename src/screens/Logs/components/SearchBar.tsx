import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import SearchIcon from "src/assets/search.png";

type Props = {
  query: string;
  setQuery: (str: string) => void;
};

export const SearchBar = ({ query, setQuery }: Props) => (
  <div style={styles.container}>
    <img src={SearchIcon} style={styles.icon} />
    <input
      placeholder="Search for logs that contain a specific word or phrase"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={styles.input}
    />
  </div>
);

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingLeft: 14,
    borderRadius: 4,
    position: "sticky",
    top: 0,
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
  },
  input: {
    outline: "none",
    backgroundColor: Colors.transparent,
    border: "none",
    paddingLeft: 8,
    width: "100%",
    paddingTop: 17,
    paddingBottom: 17,
  },
  icon: {
    width: 24,
    height: 24,
  },
};
