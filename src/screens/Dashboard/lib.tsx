import "./index.css";

import {
  DashboardDocument,
  PositionType,
  SizeType,
  widgetTimeframe,
  widgetType,
} from "logtree-types";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCanAddWidget, useFetchDashboards } from "src/redux/actionIndex";
import {
  getCanAddWidget,
  getDashboards,
  getOrganization,
} from "src/redux/organization/selector";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";

import { MIN_WIDGET_HEIGHT, MIN_WIDGET_WIDTH } from "./useResizeOrDragWidget";

export const widgetTimeframes: { [key in widgetTimeframe]: string } = {
  "24_hours": "24 hours",
  "30_days": "30 days",
};

export const useCurrentDashboard = (
  doNotRefetchDashboards?: boolean
): DashboardDocument | null => {
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const { fetch } = useFetchDashboards();
  const params = useParams();
  const { dashboardId } = params as any;

  useEffect(() => {
    if (
      !doNotRefetchDashboards &&
      organization &&
      (!dashboards.length ||
        dashboards[0].organizationId.toString() !== organization._id.toString())
    ) {
      fetch();
    }
  }, [organization?._id, dashboards.length]);

  const currentDashboard = useMemo(() => {
    return dashboards.find((d) => d._id.toString() === dashboardId) ?? null;
  }, [organization?._id, dashboards.length]);

  return currentDashboard;
};

export const LOCAL_STORAGE_DASHBOARD_ID_KEY = "viewing_dashboard_id";
export const useNavigateToDashboardIfLost = (newTab: boolean = false) => {
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const { fetch } = useFetchDashboards();
  const currentDashboard = useCurrentDashboard(true);

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  const navigateIfLost = () => {
    if (!currentDashboard && dashboards.length) {
      let dashboardId = localStorage.getItem(LOCAL_STORAGE_DASHBOARD_ID_KEY);
      if (!dashboards.find((d) => d._id.toString() === dashboardId)) {
        dashboardId = dashboards[0]._id.toString();
        localStorage.setItem(LOCAL_STORAGE_DASHBOARD_ID_KEY, dashboardId);
      }
      window.open(
        `${ORG_ROUTE_PREFIX}/${organization?.slug}${DASHBOARD_ROUTE_PREFIX}/${dashboardId}`,
        newTab ? "_blank" : "_self"
      );
    }
  };

  return { navigateIfLost };
};

export const getScrollOffset = () => {
  const element = document.getElementById("canvas-container");
  if (element) {
    return { x: element.scrollLeft, y: element.scrollTop };
  }
  return { x: 0, y: 0 };
};

export type NewFrontendWidget = {
  title: string;
  folderPaths: (string | null)[];
  type: widgetType | null;
  query?: string;
  url?: string;
  position: PositionType;
  size: SizeType;
  timeframe: widgetTimeframe;
};

export const useDesignWidgetShape = () => {
  const canAddWidget = useSelector(getCanAddWidget);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [boxPosition, setBoxPosition] = useState<PositionType>({ x: 0, y: 0 });
  const [boxSize, setBoxSize] = useState<SizeType>({ width: 0, height: 0 });
  const [newWidgets, setNewWidgets] = useState<NewFrontendWidget[]>([]);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const canvasRef = useRef(null);
  const placeholderWidgetAdjustedPositionAndSize =
    getAdjustedPositionAndSizeOfWidget(boxPosition, boxSize);
  const dispatch = useDispatch();

  const _resetBox = () => {
    setBoxPosition({ x: 0, y: 0 });
    setBoxSize({ width: 0, height: 0 });
  };

  useEffect(() => {
    if (!isDragging) {
      _resetBox();
    }
  }, [canAddWidget, isDragging]);

  useEffect(() => {
    let timeout;
    if (isErrorVisible) {
      timeout = setTimeout(() => {
        setIsErrorVisible(false);
      }, 4000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isErrorVisible]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!canAddWidget) {
      return;
    }
    setIsDragging(true);
    if (!canvasRef.current) {
      return;
    }
    const canvasRect = (canvasRef.current as any).getBoundingClientRect();
    const { x, y } = getScrollOffset();
    const offsetX = event.clientX - canvasRect.left + x;
    const offsetY = event.clientY - canvasRect.top + y;
    setBoxPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isDragging) {
      return;
    }
    if (
      Math.abs(boxSize.width) < MIN_WIDGET_WIDTH ||
      Math.abs(boxSize.height) < MIN_WIDGET_HEIGHT
    ) {
      setIsErrorVisible(true);
    } else {
      _createNewFrontendWidget();
      dispatch(setCanAddWidget(false));
    }
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isDragging || !canAddWidget || !canvasRef.current) {
      return;
    }
    const canvasRect = (canvasRef.current as any).getBoundingClientRect();
    const { x, y } = getScrollOffset();
    const offsetX = event.clientX - canvasRect.left + x;
    const offsetY = event.clientY - canvasRect.top + y;
    const newWidth = offsetX - boxPosition.x;
    const newHeight = offsetY - boxPosition.y;
    setBoxSize({ width: newWidth, height: newHeight });
  };

  const _createNewFrontendWidget = () => {
    const { top, left, width, height } = getAdjustedPositionAndSizeOfWidget(
      boxPosition,
      boxSize
    );
    setNewWidgets(
      newWidgets.concat([
        {
          title: "",
          folderPaths: [null],
          type: null,
          position: {
            x: left as number,
            y: top as number,
          },
          size: {
            width: width as number,
            height: height as number,
          },
          timeframe: widgetTimeframe.TwentyFourHours,
        },
      ])
    );
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    boxSize,
    boxPosition,
    canvasRef,
    isErrorVisible,
    newWidgets,
    setNewWidgets,
    isDragging,
    placeholderWidgetAdjustedPositionAndSize,
  };
};

// adjusts the width and height for correct sizes, positions, and orientations (for UI only)
export const getAdjustedPositionAndSizeOfWidget = (
  position: PositionType,
  size: SizeType
): CSSProperties => {
  if (size.height >= 0 && size.width >= 0) {
    return {
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
    };
  } else if (size.height < 0 && size.width >= 0) {
    // need to flip the height (incorrect one??)
    const newHeight = Math.abs(size.height);
    const newY = position.y + size.height;
    return {
      top: newY,
      left: position.x,
      width: size.width,
      height: newHeight,
    };
  } else if (size.width < 0 && size.height >= 0) {
    // need to flip the width and height but not the y position
    const newHeight = Math.abs(size.height);
    const newY = position.y;
    const newWidth = Math.abs(size.width);
    const newX = position.x + size.width;
    return {
      top: newY,
      left: newX,
      width: newWidth,
      height: newHeight,
    };
  } else {
    // need to flip both
    const newHeight = Math.abs(size.height);
    const newY = position.y + size.height;
    const newWidth = Math.abs(size.width);
    const newX = position.x + size.width;
    return {
      top: newY,
      left: newX,
      width: newWidth,
      height: newHeight,
    };
  }
};
