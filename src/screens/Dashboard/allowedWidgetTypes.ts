import { widgetType } from "logtree-types";

export const allowedWidgetTypes: {
  [key in widgetType]: {
    label: string;
    allowsQuery: boolean;
    chooseTimeframe: boolean;
    overrideChannelsToChoose?: {
      placeholder: string;
      overrideEventName: string | null;
    }[];
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
  health_monitor: {
    label: "Health monitor",
    allowsQuery: false,
    chooseTimeframe: true,
    overrideChannelsToChoose: [
      { placeholder: "Successes channel", overrideEventName: "successful" },
      { placeholder: "Errors channel", overrideEventName: "errored" },
    ],
  },
  histogram_comparison: {
    label: "Comparison over time",
    allowsQuery: false,
    chooseTimeframe: true,
    overrideChannelsToChoose: [
      { placeholder: "First channel", overrideEventName: null },
      { placeholder: "Second channel", overrideEventName: null },
    ],
  },
};
