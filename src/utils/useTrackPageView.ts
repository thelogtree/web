import { useEffect } from "react";
import { MySegment } from "./segmentClient";

// records a page view the first time the screen is loaded.
// place this hook in the top-most level of a screen (the index.tsx file)
export const useTrackPageView = () => {
  useEffect(() => {
    MySegment.page();
  }, []);
};
