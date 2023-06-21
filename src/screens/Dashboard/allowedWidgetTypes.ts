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
  pie_chart_by_content: {
    label: "Pie chart by content",
    allowsQuery: false,
    chooseTimeframe: true,
  },
};
