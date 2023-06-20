import React, { useEffect, useRef, useState } from "react";
import { Log } from "src/screens/Dashboard/components/Log";
import { LogsAfterTodayNote } from "src/screens/Logs/components/LogsAfterTodayNote";
import { FrontendLog } from "src/screens/Logs/lib";
import { useInViewport } from "react-in-viewport";
import { StylesType } from "src/utils/styles";

type Props = {
  isFirstLogAfterToday: boolean;
  log: FrontendLog;
  lastLogIndexInView: number;
  setLastLogIndexInView: (index: number) => void;
  index: number;
};

export const LogRow = ({
  isFirstLogAfterToday,
  log,
  lastLogIndexInView,
  setLastLogIndexInView,
  index,
}: Props) => {
  const [shouldRender, setShouldRender] = useState<boolean>(true);
  const myRef = useRef(null);
  const { inViewport } = useInViewport(myRef);

  useEffect(() => {
    if (inViewport) {
      setLastLogIndexInView(index);
    }
    if (inViewport || Math.abs(index - lastLogIndexInView) < 30) {
      setShouldRender(true);
    } else if (Math.abs(index - lastLogIndexInView) >= 30) {
      setShouldRender(false);
    }
  }, [inViewport, lastLogIndexInView, index]);

  return shouldRender ? (
    <div style={styles.container} key={`container:${log._id}`} ref={myRef}>
      {/* {isFirstLogAfterToday ? (
        <LogsAfterTodayNote key={`note:${log._id}`} />
      ) : null} */}
      <Log log={log} key={log._id} />
    </div>
  ) : (
    <div
      key={`container:${log._id}`}
      ref={myRef}
      style={styles.ghostContainer}
    />
  );
};

const styles: StylesType = {
  container: {
    width: "100%",
  },
  ghostContainer: {
    height: 100,
  },
};
