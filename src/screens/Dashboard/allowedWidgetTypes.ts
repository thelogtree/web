import { widgetType } from "logtree-types";

export const allowedWidgetTypes: {
  [key in widgetType]: {
    label: string;
    requiresUrl: boolean;
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
    requiresUrl: false,
  },
  histograms: {
    label: "Histogram",
    allowsQuery: false,
    chooseTimeframe: true,
    requiresUrl: false,
  },
  pie_chart_by_content: {
    label: "Pie chart by content",
    allowsQuery: false,
    chooseTimeframe: true,
    requiresUrl: false,
  },
  health_monitor: {
    label: "Health monitor",
    allowsQuery: false,
    chooseTimeframe: true,
    overrideChannelsToChoose: [
      { placeholder: "Successes channel", overrideEventName: "successful" },
      { placeholder: "Errors channel", overrideEventName: "errored" },
    ],
    requiresUrl: false,
  },
  embedded_link: {
    label: "Embed url",
    allowsQuery: false,
    chooseTimeframe: false,
    requiresUrl: true,
    overrideChannelsToChoose: [],
  },
  histogram_comparison: {
    label: "Comparison over time",
    allowsQuery: false,
    chooseTimeframe: true,
    requiresUrl: false,
    overrideChannelsToChoose: [
      { placeholder: "First channel", overrideEventName: null },
      { placeholder: "Second channel", overrideEventName: null },
    ],
  },
};
