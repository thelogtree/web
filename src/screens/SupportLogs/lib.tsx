import { useEffect, useMemo } from "react";
import { FrontendLog } from "../Logs/lib";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import { useFetchFolders } from "src/redux/actionIndex";

export const useLogFormattedTexts = (
  log: FrontendLog,
  overrideTextToCopy?: string
) => {
  const formattedString = useMemo(() => {
    const logCreatedAt = moment(log.createdAt);
    const isToday = logCreatedAt.isSame(new Date(), "day");
    return (
      (isToday ? "Today at" : "") +
      logCreatedAt.format(`${isToday ? "" : "MM/DD/YYYY"} hh:mm:ss A`) +
      " " +
      moment.tz(moment.tz.guess()).zoneAbbr()
    );
  }, []);

  const modifiedFormattedString = useMemo(() => {
    const logCreatedAt = moment(log.createdAt);
    const isRecent = moment().diff(logCreatedAt, "hours") <= 1;
    const fromNow = logCreatedAt.fromNow();
    return isRecent ? fromNow : formattedString;
  }, []);

  const textToCopy = `${formattedString}\n${overrideTextToCopy || log.content}`;

  return { modifiedFormattedString, textToCopy };
};

export const useFetchFoldersOnce = () => {
  const organization = useSelector(getOrganization);
  const { fetch } = useFetchFolders();

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);
};
