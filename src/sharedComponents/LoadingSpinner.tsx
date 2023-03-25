import React from "react";

import { TailSpin } from "react-loader-spinner";
import { Colors } from "src/utils/colors";

type Props = {
  size?: number;
  color?: string;
  style?: any;
};

const DEFAULT_SIZE = 40;
const DEFAULT_COLOR = Colors.darkGray;

export const LoadingSpinner = ({ size, color, style }: Props) => {
  const finalSize = size || DEFAULT_SIZE;
  const finalColor = color || DEFAULT_COLOR;

  return (
    <TailSpin
      height={finalSize}
      width={finalSize}
      color={finalColor}
      ariaLabel="loading"
      wrapperStyle={style}
    />
  );
};
