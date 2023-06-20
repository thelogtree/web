import { widgetType } from "logtree-types";

export const allowedWidgetTypes: {
  [key in widgetType]: {
    label: string;
    allowsQuery: boolean;
    chooseTimeframe: boolean;
  };
} = {
  logs: {
    label: "Events feed",
    allowsQuery: true,
    chooseTimeframe: false,
  },
  histograms: {
    label: "Histogram",
    allowsQuery: false,
    chooseTimeframe: true,
  },
};
