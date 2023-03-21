import React from "react";

import { TailSpin } from "react-loader-spinner";
import { Colors } from "src/utils/colors";

export const LoadingSpinner = () => (
  <TailSpin
    height={40}
    width={40}
    color={Colors.darkGray}
    ariaLabel="loading"
  />
);
