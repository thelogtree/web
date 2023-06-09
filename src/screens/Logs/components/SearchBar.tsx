import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import SearchIcon from "src/assets/search.png";
import Swal from "sweetalert2";

type Props = {
  query: string;
  setQuery: (str: string) => void;
};

export const SearchBar = ({ query, setQuery }: Props) => {
  const _openInfo = () =>
    Swal.fire({
      width: 800,
      html: `<h2 style="padding-top: 15px;">How to search</h3><p style="text-align: left; padding-top: 12px;">There are a few ways to search for logs in Logtree:</p><p style="text-align: left; padding-top: 12px;">1. Keyword search. Enter a word or phrase in the search bar to find logs that contain that word or phrase.</p><p style="text-align: left; padding-top: 12px;">2. Search by Reference ID. If you provide Reference IDs in your logs, you can search for logs with a particular ID like <pre>id:some_id_to_look_for</pre></p><p style="text-align: left; padding-top: 12px;">3. Search for a context tag value. If you provide additionalContext fields in your log, you can search for logs that have a certain field like: <pre>context.user.email="hello@logtree.co"</pre><pre>context.some_number_field=12</pre><pre>context.some_boolean_field=true</pre> or to do a context query on multiple fields you can use the '&' character like: <pre style="padding-top:15px;">context.some_number_field=12&context.some_string_field="hello"</pre> Just make sure you prefix your search with "context."</p>`,
    });

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <img src={SearchIcon} style={styles.icon} />
        <input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
      </div>
      {!query && (
        <button onClick={_openInfo} style={styles.openInfoBtn}>
          How do I search?
        </button>
      )}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingLeft: 58,
    position: "sticky",
    top: 0,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: Colors.lightGray,
    // boxShadow: "0px 2px 5px rgba(0,0,0,0.05)",
    zIndex: 3,
  },
  leftSide: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  input: {
    outline: "none",
    backgroundColor: Colors.transparent,
    border: "none",
    paddingLeft: 11,
    width: "100%",
    paddingTop: 21,
    paddingBottom: 19,
  },
  icon: {
    width: 24,
    height: 24,
  },
  openInfoBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 13,
    color: Colors.gray,
    marginRight: 58,
    width: 150,
  },
};
