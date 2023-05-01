import React, { useCallback, useEffect, useState } from "react";
import { StylesType } from "src/utils/styles";
import { useSidebarWidth } from "src/utils/useSidebarWidth";

export const Resizer = () => {
  const { changeSidebarWidth } = useSidebarWidth();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const _mouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }
      const newWidth = Math.max(Math.min(e.clientX, 350), 160);
      changeSidebarWidth(newWidth);
      e.stopPropagation();
      e.preventDefault();
    },
    [isDragging]
  );

  const _endDragging = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mouseup", _endDragging);
    return () => {
      window.removeEventListener("mouseup", _endDragging);
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", _mouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", _mouseMove);
    };
  }, [isDragging]);

  return (
    <div
      style={{
        ...styles.container,
        ...((isHovering || isDragging) && {
          backgroundColor: "rgb(190, 207, 207)",
        }),
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="resizer"
    />
  );
};

const styles: StylesType = {
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 5,
  },
};
