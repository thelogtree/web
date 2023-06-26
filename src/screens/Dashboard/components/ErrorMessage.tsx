import React, { useEffect, useState } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import ErrorIcon from "src/assets/redErrorCircle.png";

type Props = {
  isErrorVisible: boolean;
};

const BOX_TOO_SMALL_ERROR =
  "The box you drew is too small. Please draw a larger one.";

export const ErrorMessage = ({ isErrorVisible }: Props) => {
  // allows for proper animation in and snaps out
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isErrorVisible) {
      setIsComponentVisible(true);
    } else {
      setIsComponentVisible(false);
    }
  }, [isErrorVisible]);

  if (!isErrorVisible) {
    return null;
  }

  return (
    <div
      style={{ ...styles.outerContainer, opacity: isComponentVisible ? 1 : 0 }}
    >
      <div style={styles.container}>
        <img src={ErrorIcon} style={styles.errorIcon} />
        <label style={styles.error}>{BOX_TOO_SMALL_ERROR}</label>
      </div>
    </div>
  );
};

const styles: StylesType = {
  container: {
    width: 600,
    backgroundColor: Colors.veryLightRed,
    padding: 22,
    borderRadius: 20,
    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: "solid",
  },
  outerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 50,
    top: 30,
    left: 100,
    right: 100,
    transition: `opacity 0.15s linear`,
  },
  error: {
    color: Colors.black,
    fontSize: 15,
    marginLeft: 12,
  },
  errorIcon: {
    width: 30,
    height: 30,
  },
};
