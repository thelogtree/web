import React from "react";
import { prettifyObjectIntoString } from "src/screens/Logs/lib";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  userDetails: any | null;
};

export const UserDetails = ({ userDetails }: Props) =>
  userDetails ? (
    <div style={styles.container}>
      <pre style={styles.pre}>{prettifyObjectIntoString(userDetails)}</pre>
    </div>
  ) : (
    <label style={styles.noResults}>No user was found.</label>
  );

const styles: StylesType = {
  container: {
    display: "flex",
    marginTop: 30,
    width: "100%",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.lightGray,
  },
  noResults: {
    width: "100%",
    textAlign: "center",
    marginTop: 50,
  },
  pre: {
    backgroundColor: Colors.veryLightGray,
    color: Colors.black,
    borderRadius: 4,
    fontSize: 13,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: "solid",
    padding: 15,
    textAlign: "left",
    whiteSpace: "pre-wrap",
    position: "relative",
  },
};
