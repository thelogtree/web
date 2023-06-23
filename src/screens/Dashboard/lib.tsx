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
  getOrganization,
  getWidgets,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

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
    const { x, y } = getScrollOffset();
    const offsetX = event.clientX - canvasRect.left + x;
    const offsetY = event.clientY - canvasRect.top + y;
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
          type: null,
          position: boxPosition,
          size: boxSize,
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

  const _changePosition = (event: React.MouseEvent) => {
    if (!startPositionOfDrag) {
      return;
    }
    const { x, y } = getScrollOffset();
    const newX = startPositionOfDrag.x + event.clientX + x;
    const newY = startPositionOfDrag.y + event.clientY + y;
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

  const onMouseMove = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!isDragging) {
      return;
    }
    _changePosition(event);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setStartPositionOfDrag(null);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};

export const useDragWidget = (widget: WidgetDocument) => {
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);
  const organization = useSelector(getOrganization);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPositionOfDrag, setStartPositionOfDrag] =
    useState<PositionType | null>(null);

  const _changePosition = (event: React.MouseEvent) => {
    if (!startPositionOfDrag) {
      return;
    }
    const { x, y } = getScrollOffset();
    const newX = startPositionOfDrag.x + event.clientX + x;
    const newY = startPositionOfDrag.y + event.clientY + y;
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

  const onMouseMove = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!isDragging) {
      return;
    }
    _changePosition(event);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setStartPositionOfDrag(null);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
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
  const widget = useMemo(() => {
    return widgets.find((w) => w.widget._id === widgetId)
      ?.widget as any as WidgetDocument;
  }, []);
  const [initialPosition, setInitialPosition] = useState<PositionType | null>(
    null
  );
  const [initialSize, setInitialSize] = useState<SizeType | null>(null);
  const [hoveringCorner, setHoveringCorner] = useState<Corner | null>(null);
  const [cornerGettingDragged, setCornerGettingDragged] =
    useState<Corner | null>(null);
  // const [mousePosition, setMousePosition] = useState<PositionType | null>(null)

  // const moveMouse = (e: any) => setMousePosition({ x: e.clientX, y: e.clientY})

  //   useEffect(() => {
  //     document.addEventListener("mousemove", moveMouse)
  //     return () => {
  //       document.removeEventListener("mousemove", moveMouse)
  //     }
  //   }, [])

  useEffect(() => {
    let timeout = setTimeout(async () => {
      try {
        // await Api.organization.updateWidget(
        //   organization!._id.toString(),
        //   widget._id.toString(),
        //   widget.position
        // );
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
      const newWidgets = widgets.map((widgetObj) =>
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

  const onMouseUp = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setCornerGettingDragged(null);
    setInitialPosition(null);
    setInitialSize(null);
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!cornerGettingDragged || !initialPosition || !initialSize) {
        return;
      }

      switch (cornerGettingDragged) {
        case Corner.BottomLeft:
          //something
          break;
        case Corner.TopLeft:
          //something
          break;
        case Corner.BottomRight:
          const { x, y } = getScrollOffset();
          const xDiff =
            widget.position.x - event.clientX - x - initialPosition.x;
          const yDiff =
            widget.position.y - event.clientY - y - initialPosition.y;
          const newWidth = initialSize.width - xDiff;
          const newHeight = initialSize.height - yDiff;
          _updatePosition(widget.position, {
            width: newWidth,
            height: newHeight,
          });
          break;
        case Corner.TopRight:
          //something
          break;
      }
    },
    [
      widget.position.x,
      widget.position.y,
      initialPosition?.x,
      initialPosition?.y,
      initialSize?.width,
      initialSize?.height,
      cornerGettingDragged,
    ]
  );

  const onMouseLeave = useCallback((e) => {
    setHoveringCorner(null);
    onMouseUp(e);
  }, []);

  const TopLeft = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.TopLeft)}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHoveringCorner(Corner.TopLeft)}
        onMouseLeave={onMouseLeave}
        style={{
          ...resizeWidgetStyles.topLeftCorner,
          ...(hoveringCorner !== Corner.TopLeft && { border: "none" }),
        }}
      />
    ),
    [hoveringCorner, cornerGettingDragged]
  );

  const TopRight = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.TopRight)}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHoveringCorner(Corner.TopRight)}
        onMouseLeave={onMouseLeave}
        style={{
          ...resizeWidgetStyles.topRightCorner,
          ...(hoveringCorner !== Corner.TopRight && { border: "none" }),
        }}
      />
    ),
    [hoveringCorner, cornerGettingDragged]
  );

  const BottomRight = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.BottomRight)}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHoveringCorner(Corner.BottomRight)}
        onMouseLeave={onMouseLeave}
        style={{
          ...resizeWidgetStyles.bottomRightCorner,
          ...(hoveringCorner !== Corner.BottomRight && { border: "none" }),
        }}
      />
    ),
    [hoveringCorner, cornerGettingDragged]
  );

  const BottomLeft = useCallback(
    () => (
      <div
        onMouseDown={(e) => onMouseDown(e, Corner.BottomLeft)}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHoveringCorner(Corner.BottomLeft)}
        onMouseLeave={onMouseLeave}
        style={{
          ...resizeWidgetStyles.bottomLeftCorner,
          ...(hoveringCorner !== Corner.BottomLeft && { border: "none" }),
        }}
      />
    ),
    [hoveringCorner, cornerGettingDragged]
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
