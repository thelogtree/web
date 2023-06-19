import { DashboardDocument, PositionType, SizeType } from "logtree-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { DASHBOARD_ROUTE_PREFIX, ORG_ROUTE_PREFIX } from "src/RouteManager";
import { useFetchDashboards } from "src/redux/actionIndex";
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

export const useDesignWidgetShape = (isAddWidgetModalOpen: boolean) => {
  const canAddWidget = useSelector(getCanAddWidget);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [boxPosition, setBoxPosition] = useState<PositionType>({ x: 0, y: 0 });
  const [boxSize, setBoxSize] = useState<SizeType>({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const adjustedPositionAndSize = getAdjustedPositionAndSizeOfWidget(
    boxPosition,
    boxSize
  );

  const _resetBox = () => {
    setBoxPosition({ x: 0, y: 0 });
    setBoxSize({ width: 0, height: 0 });
  };

  useEffect(() => {
    if (!isDragging) {
      _resetBox();
    }
  }, [isAddWidgetModalOpen, canAddWidget, isDragging]);

  const handleMouseDown = (event) => {
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
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

  const NewWidgetBox = () => {
    if (!isDragging || !canAddWidget) {
      return null;
    }
    return (
      <div
        style={{
          ...styles.newWidgetBox,
          left: adjustedPositionAndSize.position.x,
          top: adjustedPositionAndSize.position.y,
          width: adjustedPositionAndSize.size.width,
          height: adjustedPositionAndSize.size.height,
        }}
      />
    );
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    boxSize,
    boxPosition,
    NewWidgetBox,
    canvasRef,
  };
};

const styles: StylesType = {
  newWidgetBox: {
    border: "1px solid gray",
    position: "absolute",
    borderRadius: 20,
  },
};

// adjusts the width and height for correct sizes, positions, and orientations (for UI only)
export const getAdjustedPositionAndSizeOfWidget = (
  position: PositionType,
  size: SizeType
) => {
  if (size.height >= 0 && size.width >= 0) {
    return { position, size };
  } else if (size.height < 0 && size.width >= 0) {
    // need to flip the height (incorrect one??)
    const newHeight = Math.abs(size.height);
    const newY = position.y + size.height;
    return {
      position: { y: newY, x: position.x },
      size: { width: size.width, height: newHeight },
    };
  } else if (size.width < 0 && size.height >= 0) {
    // need to flip the width and height but not the y position
    const newHeight = Math.abs(size.height);
    const newY = position.y;
    const newWidth = Math.abs(size.width);
    const newX = position.x + size.width;
    return {
      position: { y: newY, x: newX },
      size: { width: newWidth, height: newHeight },
    };
  } else {
    // need to flip both
    const newHeight = Math.abs(size.height);
    const newY = position.y + size.height;
    const newWidth = Math.abs(size.width);
    const newX = position.x + size.width;
    return {
      position: { y: newY, x: newX },
      size: { width: newWidth, height: newHeight },
    };
  }
};
