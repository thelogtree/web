import React, { useEffect, useState } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { SECONDS_TO_DELETE_LOG } from "../lib";

type Props = {
  isMouseDown: boolean;
  shouldShowAsDeleted: boolean;
  isVisibleAndAnimating: boolean;
  setIsVisibleAndAnimating: (val: boolean) => void;
};

const DURATION_BEFORE_ANIMATION_STARTS = 0.25;

export const DeleteProgressBar = ({
  isMouseDown,
  shouldShowAsDeleted,
  isVisibleAndAnimating,
  setIsVisibleAndAnimating,
}: Props) => {
  useEffect(() => {
    let timeout;
    if (isMouseDown && !shouldShowAsDeleted) {
      timeout = setTimeout(() => {
        setIsVisibleAndAnimating(true);
      }, DURATION_BEFORE_ANIMATION_STARTS * 1000);
    } else {
      setIsVisibleAndAnimating(false);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isMouseDown, shouldShowAsDeleted]);

  return shouldShowAsDeleted ? null : (
    <div
      style={{
        ...styles.container,
        ...((!isVisibleAndAnimating || !isMouseDown) && {
          opacity: 0,
        }),
      }}
    >
      <div
        style={{
          ...styles.progress,
          ...(isVisibleAndAnimating && isMouseDown
            ? { width: "100%" }
            : { transition: "none" }),
        }}
      />
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 7,
    width: 40,
    backgroundColor: Colors.white,
    borderColor: Colors.black,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    marginLeft: 12,
  },
  progress: {
    height: "100%",
    transition: `width ${
      SECONDS_TO_DELETE_LOG - DURATION_BEFORE_ANIMATION_STARTS
    }s ease-out`,
    backgroundColor: Colors.black,
    borderRadius: 20,
    width: "0%",
  },
};
