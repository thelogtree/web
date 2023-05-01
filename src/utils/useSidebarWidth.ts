import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarWidth } from "src/redux/actionIndex";
import { getSidebarWidth } from "src/redux/organization/selector";

const LOCAL_STORAGE_KEY = "sidebar_width";

export const useSidebarWidth = () => {
  const sidebarWidth = useSelector(getSidebarWidth);
  const dispatch = useDispatch();

  useEffect(() => {
    const locallyStoredSidebarWidth = parseInt(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "0"
    );
    if (locallyStoredSidebarWidth) {
      dispatch(setSidebarWidth(locallyStoredSidebarWidth));
    }
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, sidebarWidth.toString());
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [sidebarWidth]);

  const changeSidebarWidth = (newWidth: number) => {
    if (newWidth !== sidebarWidth) {
      dispatch(setSidebarWidth(newWidth));
    }
  };

  return { changeSidebarWidth, sidebarWidth };
};
