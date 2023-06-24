import {
  DashboardDocument,
  PositionType,
  SizeType,
  WidgetDocument,
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
import { useHistory, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";
import { Api } from "src/api";
import {
  setCanAddWidget,
  setWidgets,
  useFetchDashboards,
} from "src/redux/actionIndex";
import { FrontendWidget } from "src/redux/organization/reducer";
import {
  getCanAddWidget,
  getDashboards,
  getLastFetchedWidgetData,
  getOrganization,
  getWidgets,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import _ from "lodash";
import "./index.css";

export const widgetTimeframes: { [key in widgetTimeframe]: string } = {
  "24_hours": "24 hours",
  "30_days": "30 days",
};

const MIN_WIDGET_WIDTH = 200;
const MIN_WIDGET_HEIGHT = 200;

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

export const useDragNewWidget = (
  indexOfWidgetInArr: number,
  widgets: NewFrontendWidget[],
  setNewWidgets: (newWidgets: NewFrontendWidget[]) => void
) => {
  const widget = widgets[indexOfWidgetInArr];
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPositionOfDrag, setStartPositionOfDrag] =
    useState<PositionType | null>(null);
  const [mousePosition, setMousePosition] = useState<PositionType | null>(null);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (isDragging) {
      document
        .getElementById("canvas-container")
        ?.addEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const _changePosition = () => {
    if (!startPositionOfDrag || !mousePosition) {
      return;
    }
    const { x, y } = getScrollOffset();
    const newX = startPositionOfDrag.x + mousePosition.x + x;
    const newY = startPositionOfDrag.y + mousePosition.y + y;
    const newWidgetTemp = {
      ...widget,
      position: {
        x: newX,
        y: newY,
      },
    } as NewFrontendWidget;
    setNewWidgets(
      widgets.map((w: NewFrontendWidget, i) =>
        i === indexOfWidgetInArr ? newWidgetTemp : w
      )
    );
  };

  const onMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDragging(true);
    const { x: scrollX, y: scrollY } = getScrollOffset();
    const x = widget.position.x - event.clientX - scrollX;
    const y = widget.position.y - event.clientY - scrollY;
    setStartPositionOfDrag({ x, y });
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setStartPositionOfDrag(null);
  };

  useEffect(() => {
    if (isDragging) {
      _changePosition();
    }
  }, [mousePosition?.x, mousePosition?.y]);

  return {
    onMouseDown,
  };
};

export const useDragWidget = (widget: WidgetDocument) => {
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);
  const organization = useSelector(getOrganization);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPositionOfDrag, setStartPositionOfDrag] =
    useState<PositionType | null>(null);
  const [mousePosition, setMousePosition] = useState<PositionType | null>(null);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (isDragging) {
      document
        .getElementById("canvas-container")
        ?.addEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const _changePosition = () => {
    if (!startPositionOfDrag || !mousePosition) {
      return;
    }
    const { x, y } = getScrollOffset();
    const newX = startPositionOfDrag.x + mousePosition.x + x;
    const newY = startPositionOfDrag.y + mousePosition.y + y;
    const newWidgetTemp = {
      ...widget,
      position: {
        x: newX,
        y: newY,
      },
    } as WidgetDocument;
    dispatch(
      setWidgets(
        widgets.map((w) => ({
          widget: w.widget._id === widget._id ? newWidgetTemp : w.widget,
          data: w.data,
        }))
      )
    );
  };

  useEffect(() => {
    let timeout = setTimeout(async () => {
      try {
        await Api.organization.updateWidget(
          organization!._id.toString(),
          widget._id.toString(),
          widget.position
        );
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [widget.position.x, widget.position.y]);

  const onMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDragging(true);
    const { x: scrollX, y: scrollY } = getScrollOffset();
    const x = widget.position.x - event.clientX - scrollX;
    const y = widget.position.y - event.clientY - scrollY;
    setStartPositionOfDrag({ x, y });
  };

  useEffect(() => {
    if (isDragging) {
      _changePosition();
    }
  }, [mousePosition?.x, mousePosition?.y]);

  const onMouseUp = () => {
    setIsDragging(false);
    setStartPositionOfDrag(null);
  };

  return {
    onMouseDown,
    isDragging,
  };
};

enum Corner {
  TopRight = "top_right",
  BottomRight = "bottom_right",
  BottomLeft = "bottom_left",
  TopLeft = "top_left",
}
export const useResizeWidget = (widgetId: string) => {
  const organization = useSelector(getOrganization);
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);
  const widget = widgets.find((w) => w.widget._id === widgetId)
    ?.widget as any as WidgetDocument;
  const [initialPosition, setInitialPosition] = useState<PositionType | null>(
    null
  );
  const [initialSize, setInitialSize] = useState<SizeType | null>(null);
  const [cornerGettingDragged, setCornerGettingDragged] =
    useState<Corner | null>(null);
  const [mousePosition, setMousePosition] = useState<PositionType | null>(null);
  const lastFetchedWidgetData = useSelector(getLastFetchedWidgetData);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (cornerGettingDragged) {
      document
        .getElementById("canvas-container")
        ?.addEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.removeEventListener("mouseup", onMouseUp);
    };
  }, [cornerGettingDragged]);

  useEffect(() => {
    let timeout = setTimeout(async () => {
      try {
        await Api.organization.updateWidget(
          organization!._id.toString(),
          widget._id.toString(),
          widget.position,
          widget.size
        );
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    widget.position.x,
    widget.position.y,
    widget.size.width,
    widget.size.height,
  ]);

  const _updatePosition = useCallback(
    (newPosition: PositionType, newSize: SizeType) => {
      newSize.width = Math.max(newSize.width, MIN_WIDGET_WIDTH);
      newSize.height = Math.max(newSize.height, MIN_WIDGET_HEIGHT);
      const newWidgets = widgets.map((widgetObj, i) =>
        widgetObj.widget._id === widgetId
          ? ({
              data: widgetObj.data,
              widget: {
                ...widget,
                position: newPosition,
                size: newSize,
              },
            } as FrontendWidget)
          : widgetObj
      );
      dispatch(setWidgets(newWidgets));
    },
    [lastFetchedWidgetData]
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent, corner: Corner) => {
      event.stopPropagation();
      const { x: scrollX, y: scrollY } = getScrollOffset();
      const x = widget.position.x - event.clientX - scrollX;
      const y = widget.position.y - event.clientY - scrollY;
      setInitialPosition({ x, y });
      setInitialSize(widget.size);
      setCornerGettingDragged(corner);
    },
    [
      widget.position.x,
      widget.position.y,
      widget.size.width,
      widget.size.height,
    ]
  );

  const onMouseUp = useCallback(() => {
    setCornerGettingDragged(null);
    setInitialPosition(null);
    setInitialSize(null);
    setMousePosition(null);
  }, []);

  useEffect(() => {
    if (
      cornerGettingDragged &&
      initialPosition &&
      initialSize &&
      mousePosition
    ) {
      const { x, y } = getScrollOffset();

      if (cornerGettingDragged === Corner.BottomLeft) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newX = widget.position.x - xDiff;
        const newWidth = widget.size.width + xDiff;
        const newHeight = initialSize.height - yDiff;
        _updatePosition(
          {
            x: newX,
            y: widget.position.y,
          },
          {
            width: newWidth,
            height: newHeight,
          }
        );
      } else if (cornerGettingDragged === Corner.TopLeft) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const newX = widget.position.x - xDiff;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newY = widget.position.y - yDiff;
        const newWidth = widget.size.width + xDiff;
        const newHeight = widget.size.height + yDiff;
        _updatePosition(
          {
            x: newX,
            y: newY,
          },
          {
            width: newWidth,
            height: newHeight,
          }
        );
      } else if (cornerGettingDragged === Corner.TopRight) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newY = widget.position.y - yDiff;
        const newWidth = initialSize.width - xDiff;
        const newHeight = widget.size.height + yDiff;
        _updatePosition(
          {
            x: widget.position.x,
            y: newY,
          },
          {
            width: newWidth,
            height: newHeight,
          }
        );
      } else if (cornerGettingDragged === Corner.BottomRight) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newWidth = initialSize.width - xDiff;
        const newHeight = initialSize.height - yDiff;
        _updatePosition(widget.position, {
          width: newWidth,
          height: newHeight,
        });
      }
    }
  }, [mousePosition?.x, mousePosition?.y]);

  const TopLeft = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.TopLeft)}
        style={resizeWidgetStyles.topLeftCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  const TopRight = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.TopRight)}
        style={resizeWidgetStyles.topRightCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  const BottomRight = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.BottomRight)}
        style={resizeWidgetStyles.bottomRightCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  const BottomLeft = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.BottomLeft)}
        style={resizeWidgetStyles.bottomLeftCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  return {
    CornerBlocks: (
      <>
        <BottomRight />
        <BottomLeft />
        <TopLeft />
        <TopRight />
      </>
    ),
    isDragging: !!cornerGettingDragged,
  };
};

export const useResizeNewWidget = (
  indexInArr: number,
  newWidgets: NewFrontendWidget[],
  setNewWidgets: (newWidgets: NewFrontendWidget[]) => void
) => {
  const widget = newWidgets[indexInArr];
  const [initialPosition, setInitialPosition] = useState<PositionType | null>(
    null
  );
  const [initialSize, setInitialSize] = useState<SizeType | null>(null);
  const [cornerGettingDragged, setCornerGettingDragged] =
    useState<Corner | null>(null);
  const [mousePosition, setMousePosition] = useState<PositionType | null>(null);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (cornerGettingDragged) {
      document
        .getElementById("canvas-container")
        ?.addEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-fullscreen")
        ?.removeEventListener("mouseup", onMouseUp);
    };
  }, [cornerGettingDragged]);

  const _updatePosition = useCallback(
    (newPosition: PositionType, newSize: SizeType) => {
      newSize.width = Math.max(newSize.width, MIN_WIDGET_WIDTH);
      newSize.height = Math.max(newSize.height, MIN_WIDGET_HEIGHT);
      let newWidgetsTemp = newWidgets.slice();
      newWidgetsTemp[indexInArr] = {
        ...widget,
        position: newPosition,
        size: newSize,
      } as NewFrontendWidget;
      setNewWidgets(newWidgetsTemp);
    },
    []
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent, corner: Corner) => {
      event.stopPropagation();
      const { x: scrollX, y: scrollY } = getScrollOffset();
      const x = widget.position.x - event.clientX - scrollX;
      const y = widget.position.y - event.clientY - scrollY;
      setInitialPosition({ x, y });
      setInitialSize(widget.size);
      setCornerGettingDragged(corner);
    },
    [
      widget.position.x,
      widget.position.y,
      widget.size.width,
      widget.size.height,
    ]
  );

  const onMouseUp = useCallback(() => {
    setCornerGettingDragged(null);
    setInitialPosition(null);
    setInitialSize(null);
    setMousePosition(null);
  }, []);

  useEffect(() => {
    if (
      cornerGettingDragged &&
      initialPosition &&
      initialSize &&
      mousePosition
    ) {
      const { x, y } = getScrollOffset();

      if (cornerGettingDragged === Corner.BottomLeft) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newX = widget.position.x - xDiff;
        const newWidth = widget.size.width + xDiff;
        const newHeight = initialSize.height - yDiff;
        _updatePosition(
          {
            x: newX,
            y: widget.position.y,
          },
          {
            width: newWidth,
            height: newHeight,
          }
        );
      } else if (cornerGettingDragged === Corner.TopLeft) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const newX = widget.position.x - xDiff;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newY = widget.position.y - yDiff;
        const newWidth = widget.size.width + xDiff;
        const newHeight = widget.size.height + yDiff;
        _updatePosition(
          {
            x: newX,
            y: newY,
          },
          {
            width: newWidth,
            height: newHeight,
          }
        );
      } else if (cornerGettingDragged === Corner.TopRight) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newY = widget.position.y - yDiff;
        const newWidth = initialSize.width - xDiff;
        const newHeight = widget.size.height + yDiff;
        _updatePosition(
          {
            x: widget.position.x,
            y: newY,
          },
          {
            width: newWidth,
            height: newHeight,
          }
        );
      } else if (cornerGettingDragged === Corner.BottomRight) {
        const xDiff =
          widget.position.x - mousePosition.x - x - initialPosition.x;
        const yDiff =
          widget.position.y - mousePosition.y - y - initialPosition.y;
        const newWidth = initialSize.width - xDiff;
        const newHeight = initialSize.height - yDiff;
        _updatePosition(widget.position, {
          width: newWidth,
          height: newHeight,
        });
      }
    }
  }, [mousePosition?.x, mousePosition?.y]);

  const TopLeft = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.TopLeft)}
        style={resizeWidgetStyles.topLeftCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  const TopRight = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.TopRight)}
        style={resizeWidgetStyles.topRightCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  const BottomRight = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.BottomRight)}
        style={resizeWidgetStyles.bottomRightCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  const BottomLeft = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.BottomLeft)}
        style={resizeWidgetStyles.bottomLeftCorner}
        className="cornerBlock"
      />
    ),
    [cornerGettingDragged]
  );

  return (
    <>
      <BottomRight />
      <BottomLeft />
      <TopLeft />
      <TopRight />
    </>
  );
};

const resizeWidgetStyles: StylesType = {
  topLeftCorner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 34,
    height: 34,
    cursor: "nwse-resize",
    borderTopLeftRadius: 18,
    borderLeftColor: Colors.lightGray,
    borderLeftWidth: 6,
    borderLeftStyle: "solid",
    borderTopColor: Colors.lightGray,
    borderTopWidth: 6,
    borderTopStyle: "solid",
    backgroundColor: Colors.transparent,
    zIndex: 60,
  },
  topRightCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 34,
    height: 34,
    cursor: "nesw-resize",
    borderTopRightRadius: 18,
    borderTopColor: Colors.lightGray,
    borderTopWidth: 6,
    borderTopStyle: "solid",
    borderRightColor: Colors.lightGray,
    borderRightWidth: 6,
    borderRightStyle: "solid",
    backgroundColor: Colors.transparent,
    zIndex: 60,
  },
  bottomLeftCorner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 34,
    height: 34,
    cursor: "nesw-resize",
    borderBottomLeftRadius: 18,
    borderLeftColor: Colors.lightGray,
    borderLeftWidth: 6,
    borderLeftStyle: "solid",
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 6,
    borderBottomStyle: "solid",
    backgroundColor: Colors.transparent,
    zIndex: 60,
  },
  bottomRightCorner: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    cursor: "nwse-resize",
    borderBottomRightRadius: 18,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 6,
    borderBottomStyle: "solid",
    borderRightColor: Colors.lightGray,
    borderRightWidth: 6,
    borderRightStyle: "solid",
    backgroundColor: Colors.transparent,
    zIndex: 60,
  },
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
