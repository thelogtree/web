import { PositionType, SizeType, WidgetDocument } from "logtree-types";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLastFetchedWidgetData,
  getOrganization,
  getWidgets,
} from "src/redux/organization/selector";
import { getScrollOffset } from "./lib";
import { Api } from "src/api";
import { setWidgets } from "src/redux/actionIndex";
import { Colors } from "src/utils/colors";
import { FrontendWidget } from "src/redux/organization/reducer";
import { StylesType } from "src/utils/styles";

export const MIN_WIDGET_WIDTH = 200;
export const MIN_WIDGET_HEIGHT = 200;

export enum Corner {
  TopRight = "top_right",
  BottomRight = "bottom_right",
  BottomLeft = "bottom_left",
  TopLeft = "top_left",
}

export const useResizeOrDragWidget = (widget: WidgetDocument) => {
  const organization = useSelector(getOrganization);
  const { onMouseDown, isDragging } = useDragWidget(widget);
  const { CornerBlocks, isResizing } = useResizeWidget(widget);

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

  return { onMouseDown, CornerBlocks, isDragging, isResizing };
};

const useResizeWidget = (widget: WidgetDocument) => {
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);
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
        .getElementById("canvas-container")
        ?.addEventListener("mouseup", onMouseUp);
    } else {
      onMouseUp();
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mouseup", onMouseUp);
    };
  }, [cornerGettingDragged]);

  const _updatePosition = useCallback(
    (newPosition: PositionType, newSize: SizeType) => {
      newSize.width = Math.max(newSize.width, MIN_WIDGET_WIDTH);
      newSize.height = Math.max(newSize.height, MIN_WIDGET_HEIGHT);
      const newWidgets = widgets.map((widgetObj, i) =>
        widgetObj.widget._id === widget._id
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

  const onMouseDown = (event: React.MouseEvent, corner: Corner) => {
    event.stopPropagation();
    const { x: scrollX, y: scrollY } = getScrollOffset();
    const x = widget.position.x - event.clientX - scrollX;
    const y = widget.position.y - event.clientY - scrollY;
    setInitialPosition({ x, y });
    setInitialSize(widget.size);
    setCornerGettingDragged(corner);
  };

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
    isResizing: !!cornerGettingDragged,
  };
};

const useDragWidget = (widget: WidgetDocument) => {
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);
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
        .getElementById("canvas-container")
        ?.addEventListener("mouseup", onMouseUp);
    }
    if (!isDragging) {
      onMouseUp();
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("canvas-container")
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
