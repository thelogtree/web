import { isMobile } from "react-device-detect";

export const constants = {
  sidebarWidth: isMobile ? 0 : 220,
};
