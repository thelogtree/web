import { PositionType, SizeType, WidgetDocument } from "logtree-types";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "src/api";
import { setWidgets } from "src/redux/actionIndex";
import { FrontendWidget } from "src/redux/organization/reducer";
import {
  getLastFetchedWidgetData,
  getOrganization,
  getWidgets,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

import { getScrollOffset } from "./lib";

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
  const [cornerGettingResized, setCornerGettingResized] =
    useState<Corner | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<PositionType | null>(null);
  const [initialPosition, setInitialPosition] = useState<PositionType | null>(
    null
  );
  const [initialSize, setInitialSize] = useState<SizeType | null>(null);
  const [downMousePosition, setDownMousePosition] =
    useState<PositionType | null>(null);
  const { onMouseDown } = useDragWidget(
    widget,
    mousePosition,
    downMousePosition,
    initialPosition,
    setInitialPosition,
    isDragging,
    setIsDragging
  );
  const CornerBlocks = useResizeWidget(
    widget,
    mousePosition,
    downMousePosition,
    initialPosition,
    setInitialPosition,
    initialSize,
    setInitialSize,
    cornerGettingResized,
    setCornerGettingResized
  );
  const isResizing = !!cornerGettingResized;

  const _onMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });

  const _onMouseUp = useCallback(() => {
    setInitialPosition(null);
    setInitialSize(null);
    setMousePosition(null);
    setIsDragging(false);
    setCornerGettingResized(null);
    setDownMousePosition(null);
  }, []);

  const _onMouseDown = (e) =>
    setDownMousePosition({ x: e.clientX, y: e.clientY });

  useEffect(() => {
    if (downMousePosition) {
      const { x: scrollX, y: scrollY } = getScrollOffset();
      const x = widget.position.x - downMousePosition.x - scrollX;
      const y = widget.position.y - downMousePosition.y - scrollY;
      setInitialPosition({ x, y });
      setInitialSize(widget.size);
    }
  }, [downMousePosition?.x, downMousePosition?.y]);

  useEffect(() => {
    document
      .getElementById("canvas-container")
      ?.addEventListener("mousedown", _onMouseDown);
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousedown", _onMouseDown);
    };
  }, []);

  useEffect(() => {
    document
      .getElementById("canvas-container")
      ?.addEventListener("mouseup", _onMouseUp);
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mouseup", _onMouseUp);
    };
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document
        .getElementById("canvas-container")
        ?.addEventListener("mousemove", _onMouseMove);
    }
    return () => {
      document
        .getElementById("canvas-container")
        ?.removeEventListener("mousemove", _onMouseMove);
    };
  }, [isDragging, isResizing]);

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

// ----- RESIZING THE WIDGET ----- //
const useResizeWidget = (
  widget: WidgetDocument,
  mousePosition: PositionType | null,
  mouseDownPosition: PositionType | null,
  initialPosition: PositionType | null,
  setInitialPosition: (initialPosition: PositionType | null) => void,
  initialSize: SizeType | null,
  setInitialSize: (initialSize: SizeType | null) => void,
  cornerGettingDragged: Corner | null,
  setCornerGettingDragged: (corner: Corner | null) => void
) => {
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);
  const lastFetchedWidgetData = useSelector(getLastFetchedWidgetData);

  const _updatePosition = useCallback(
    (newPosition: PositionType, newSize: SizeType) => {
      newSize.width = Math.max(newSize.width, MIN_WIDGET_WIDTH);
      newSize.height = Math.max(newSize.height, MIN_WIDGET_HEIGHT);
      const newWidgets = widgets.map((widgetObj) =>
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
    [lastFetchedWidgetData, mouseDownPosition?.x, mouseDownPosition?.y]
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

  useEffect(() => {
    if (
      cornerGettingDragged &&
      initialPosition &&
      initialSize &&
      mousePosition &&
      mouseDownPosition
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

// ----- DRAGGING THE WIDGET ----- //
const useDragWidget = (
  widget: WidgetDocument,
  mousePosition: PositionType | null,
  mouseDownPosition: PositionType | null,
  initialPosition: PositionType | null,
  setInitialPosition: (initialPosition: PositionType | null) => void,
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void
) => {
  const dispatch = useDispatch();
  const widgets = useSelector(getWidgets);

  const _changePosition = () => {
    if (!initialPosition || !mousePosition || !mouseDownPosition) {
      return;
    }
    const { x, y } = getScrollOffset();
    const newX = initialPosition.x + mousePosition.x + x;
    const newY = initialPosition.y + mousePosition.y + y;
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
    setInitialPosition({ x, y });
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
