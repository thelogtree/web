import { WidgetDocument } from "logtree-types";
import React from "react";
import { StylesType } from "src/utils/styles";

type Props = {
  html: any;
};

export const EmbeddedLink = ({ html }: Props) => (
  <iframe srcDoc={html} style={styles.container} />
);

const styles: StylesType = {
  container: {
    width: "100%",
    height: "100%",
    marginTop: 12,
  },
};
