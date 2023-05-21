import React from "react";
import { FrontendLog, useAdditionalContextOfLog } from "../lib";
import { Switch, Tooltip } from "antd";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  log: FrontendLog;
  isShowingAdditionalContext: boolean;
  setIsShowingAdditionalContext: (isShowing: boolean) => void;
};

export const FlipToAdditionalContextButton = ({
  log,
  isShowingAdditionalContext,
  setIsShowingAdditionalContext,
}: Props) => {
  const additionalContextCleaned = useAdditionalContextOfLog(log);

  if (!additionalContextCleaned) {
    return null;
  }

  return (
    <Tooltip
      title={
        isShowingAdditionalContext ? "Stop showing context" : "Show context"
      }
      style={styles.tooltipContainer}
    >
      <Switch
        checked={isShowingAdditionalContext}
        onChange={(isShowing) => setIsShowingAdditionalContext(isShowing)}
        style={{
          ...styles.switch,
          backgroundColor: isShowingAdditionalContext
            ? Colors.black
            : Colors.lighterGray,
        }}
      />
    </Tooltip>
  );
};

const styles: StylesType = {
  tooltipContainer: {
    marginRight: 12,
  },
  switch: {
    transform: "scale(0.6)",
  },
};
