import {
  DashboardDocument,
  PositionType,
  SizeType,
  WidgetDocument,
  widgetType,
} from "logtree-types";
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";
import { setCanAddWidget, useFetchDashboards } from "src/redux/actionIndex";
import { FrontendWidget } from "src/redux/organization/reducer";
import {
  getCanAddWidget,
  getDashboards,
  getOrganization,
  getWidgets,
} from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";

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
export const useNavigateToDashboardIfLost = () => {
  const organization = useSelector(getOrganization);
  const dashboards = useSelector(getDashboards);
  const { fetch } = useFetchDashboards();
  const history = useHistory();
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
      history.push(
        `${ORG_ROUTE_PREFIX}/${organization?.slug}${DASHBOARD_ROUTE_PREFIX}/${dashboardId}`
      );
    }
  };

  return { navigateIfLost };
};

export type NewFrontendWidget = {
  title: string;
  folderPaths: (string | null)[];
  type: widgetType;
  query?: string;
  position: PositionType;
  size: SizeType;
};

export const useDesignWidgetShape = () => {
  const canAddWidget = useSelector(getCanAddWidget);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [boxPosition, setBoxPosition] = useState<PositionType>({ x: 0, y: 0 });
  const [boxSize, setBoxSize] = useState<SizeType>({ width: 0, height: 0 });
  const [newWidgets, setNewWidgets] = useState<NewFrontendWidget[]>([]);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const canvasRef = useRef(null);
  const placeholderWidgetAdjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    boxPosition,
    boxSize
  );
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
    const offsetX = event.clientX - canvasRect.left;
    const offsetY = event.clientY - canvasRect.top;
    setBoxPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isDragging) {
      return;
    }
    if (Math.abs(boxSize.width) < 200 || Math.abs(boxSize.height) < 200) {
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
    const offsetX = event.clientX - canvasRect.left;
    const offsetY = event.clientY - canvasRect.top;
    const newWidth = offsetX - boxPosition.x;
    const newHeight = offsetY - boxPosition.y;
    setBoxSize({ width: newWidth, height: newHeight });
  };

  const _createNewFrontendWidget = () => {
    setNewWidgets(
      newWidgets.concat([
        {
          title: "",
          folderPaths: [null],
          type: widgetType.Logs,
          position: boxPosition,
          size: boxSize,
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
    placeholderWidgetAdjustedPositionAndSize
  };
};

export const useDragWidget = (
  widgets: NewFrontendWidget[],
  indexInArr: number,
  setWidgets: (widgets: NewFrontendWidget[]) => void
) => {
  const widget = widgets[indexInArr];
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const _changePosition = (event: React.MouseEvent) => {
    const newX = event.clientX;
    const newY = event.clientY;
    const newWidgetTemp = {
      ...widget,
      position: {
        x: newX,
        y: newY,
      },
    };
    let newWidgetsTemp = widgets.slice();
    newWidgetsTemp[indexInArr] = newWidgetTemp;
    setWidgets(newWidgetsTemp);
  };

  const onMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const onMouseMove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isDragging) {
      return;
    }
    _changePosition(event);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
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
