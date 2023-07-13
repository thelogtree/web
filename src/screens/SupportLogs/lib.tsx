import { useEffect, useMemo, useState } from "react";
import { FrontendLog } from "../Logs/lib";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { getOrganization, getUser } from "src/redux/organization/selector";
import { useFetchFolders } from "src/redux/actionIndex";
import { showGenericErrorAlert } from "src/utils/helpers";
import { Api } from "src/api";
import { quickGptEnum } from "logtree-types/misc";
import { MySegment, SegmentEventsEnum } from "src/utils/segmentClient";

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

  const textToCopy = `${formattedString}\n${overrideTextToCopy || log.content}`;

  return { modifiedFormattedString: formattedString, textToCopy };
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

export const useQuickGPTAction = (email: string) => {
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    setResponse("");
  }, [email]);

  const submitQuickGpt = async (quickGptType: quickGptEnum) => {
    try {
      if (isLoading) {
        return;
      }
      MySegment.track(SegmentEventsEnum.ClickedDiagnoseProblemButton, {
        user_email: user?.email,
        query_email: email,
      });
      setResponse("");
      setIsLoading(true);
      const res = await Api.organization.quickGpt(
        organization!._id.toString(),
        email,
        quickGptType
      );
      const { response: fetchedResponse } = res.data;
      setResponse(fetchedResponse);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    submitQuickGpt,
    response,
  };
};
