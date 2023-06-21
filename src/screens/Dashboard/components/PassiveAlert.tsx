import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWidgets } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

type Props = {
  isFetchingWidgets: boolean;
};

export const PassiveAlert = ({ isFetchingWidgets }: Props) => {
  const widgets = useSelector(getWidgets);
  const shouldTryShowingAlert = !widgets.length && !isFetchingWidgets;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [alreadyShowed, setAlreadyShowed] = useState<boolean>(false);

  useEffect(() => {
    if (shouldTryShowingAlert && !alreadyShowed) {
      setTimeout(() => {
        setIsVisible(true);
      }, 400);
      setAlreadyShowed(true);
    }
  }, [shouldTryShowingAlert]);

  useEffect(() => {
    let timeout;
    if (isVisible) {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isVisible]);

  if (!shouldTryShowingAlert) {
    return null;
  }

  return (
    <div style={{ ...styles.container, opacity: isVisible ? 1 : 0 }}>
      <label style={styles.title}>Create your first widget!</label>
      <label style={styles.desc}>
        Hit the widget creation square in the top right and drag a box on the
        screen.
      </label>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 20,
    boxShadow: "0px 4px 14px rgba(0,0,0,0.1)",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.gray,
    transition: `opacity 0.15s linear`,
    padding: 30,
    position: "fixed",
    bottom: 50,
    right: 50,
    zIndex: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  desc: {
    fontSize: 14,
    color: Colors.darkerGray,
    paddingTop: 8,
  },
};
