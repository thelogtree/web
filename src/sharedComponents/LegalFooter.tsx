import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export const LegalFooter = () => (
  <span style={styles.container}>
    © Logtree LLC{" "}
    <a href="/policies/terms-of-service" target="_blank">
      Terms of service
    </a>{" "}
    <a href="/policies/terms-of-service" target="_blank">
      Privacy policy
    </a>
  </span>
);

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    color: Colors.gray,
    fontSize: 11,
    backgroundColor: "transparent",
  },
  link: {
    textDecoration: "underline",
    cursor: "pointer",
    color: Colors.gray,
    marginLeft: 8,
  },
};
