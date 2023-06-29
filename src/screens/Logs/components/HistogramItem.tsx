import moment from "moment-timezone";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Tooltip as AntdTooltip } from "antd";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Colors } from "src/utils/colors";
import { inferIdType, shortenString } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { GLOBAL_SEARCH_SUFFIX, SUPPORT_TOOL_SUFFIX } from "src/RouteManager";
import { useHistory, useLocation } from "react-router-dom";
import { DataBox } from "src/screens/Dashboard/components/widgetTypes/Histogram";

export type StatHistogram = {
  contentKey: string;
  numReferenceIdsAffected: number;
  histogramData: DataBox[];
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload[0].value) {
    return null;
  }

  const count = payload[0].payload.count;
  const dates = payload[0].payload.date;
  return (
    <div style={styles.tooltipContainer}>
      <label style={styles.tooltipCount}>
        {count} {count === 1 ? "instance" : "instances"}
      </label>
      <label style={styles.tooltipDates}>{dates}</label>
    </div>
  );
};

type Props = {
  histogram: StatHistogram;
  isVisualizingByReferenceId: boolean;
  firstLogId?: string;
};

const MAX_CONTENT_KEY_LENGTH = 55;

export const HistogramItem = ({
  histogram,
  isVisualizingByReferenceId,
  firstLogId,
}: Props) => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const organization = useSelector(getOrganization);
  const timeAgo = useMemo(() => {
    const tempDateStr = moment(histogram.histogramData[0].floorDate)
      .fromNow(true)
      .replace("a ", "");
    if (tempDateStr === "day") {
      return "24 hours";
    }
    if (tempDateStr.includes("days") || tempDateStr.includes("month")) {
      return `${organization?.logRetentionInDays} days`;
    }
    return tempDateStr;
  }, [histogram.histogramData[0].floorDate, organization?.logRetentionInDays]);

  const data = useMemo(() => {
    return histogram.histogramData.map((dataInterval) => ({
      date: `${moment(dataInterval.floorDate).format(
        "MM/DD/YYYY hh:mm A"
      )} to ${moment(dataInterval.ceilingDate).format("MM/DD/YYYY hh:mm A")}`,
      count: dataInterval.count,
    }));
  }, [
    histogram.histogramData.length,
    histogram.histogramData[0].floorDate.toString(),
  ]);
  const histogramTitle = shortenString(
    histogram.contentKey,
    MAX_CONTENT_KEY_LENGTH
  );

  const _searchForReferenceId = () => {
    window.open(
      `/org/${organization!.slug}${GLOBAL_SEARCH_SUFFIX}?query=id:${
        histogram.contentKey
      }`,
      "_blank"
    );
  };

  const _searchForContentMatch = () => {
    params.set("query", histogram.contentKey);
    history.replace({
      pathname: location.pathname,
      search: histogram.contentKey ? `?${params.toString()}` : "",
    });
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <AntdTooltip
          title={
            isVisualizingByReferenceId
              ? "Click to do a Global Search for this ID"
              : histogram.contentKey.length > MAX_CONTENT_KEY_LENGTH
              ? histogram.contentKey
              : ""
          }
        >
          <a
            style={styles.histogramTitle}
            className="referenceIdLink"
            onClick={
              isVisualizingByReferenceId
                ? _searchForReferenceId
                : _searchForContentMatch
            }
          >
            {histogramTitle}
          </a>
        </AntdTooltip>
        <label style={styles.timeAgo}>Last {timeAgo}</label>
        {isVisualizingByReferenceId || !firstLogId ? null : (
          <label style={styles.numAffected}>
            {histogram.numReferenceIdsAffected}{" "}
            {inferIdType(firstLogId, histogram.numReferenceIdsAffected)}
          </label>
        )}
      </div>
      <div style={styles.graphContainer}>
        <ResponsiveContainer width="100%" height={60}>
          <BarChart
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <XAxis tick={false} stroke={Colors.purple50} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              position={{ y: 28 }}
            />
            <Bar dataKey="count" fill={Colors.purple500} barSize={110} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 4,
    backgroundColor: Colors.white,
    width: "100%",
    height: 150,
    marginBottom: 20,
    outline: "none",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.purple200,
  },
  top: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  tooltipContainer: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderStyle: "solid",
    boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  tooltipCount: {
    fontSize: 15,
    fontWeight: 600,
    paddingBottom: 8,
  },
  tooltipDates: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
  },
  histogramTitle: {
    fontSize: 15,
    fontWeight: 400,
    paddingBottom: 4,
    color: Colors.black,
  },
  timeAgo: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
  },
  numAffected: {
    color: Colors.darkerGray,
    fontSize: 12,
    fontWeight: 300,
    paddingTop: 3,
  },
  graphContainer: {
    width: "100%",
    marginBottom: -26,
  },
};
