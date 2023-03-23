import React, { useState } from "react";
import { StylesType } from "src/utils/styles";

export const AcceptInviteForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return <div style={styles.container}></div>;
};

const styles: StylesType = {
  container: {
    width: "100%",
    height: "100%",
  },
};
