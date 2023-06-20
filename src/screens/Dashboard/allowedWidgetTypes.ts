import { widgetType } from "logtree-types";

export const allowedWidgetTypes: {
  [key in widgetType]: { label: string; allowsQuery: boolean };
} = {
  logs: {
    label: "Events feed",
    allowsQuery: true,
  },
  histograms: {
    label: "24 hour histogram",
    allowsQuery: false,
  },
};
