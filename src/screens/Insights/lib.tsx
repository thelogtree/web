import { FolderDocument } from "logtree-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getOrganization } from "src/redux/organization/selector";

export type Insight = {
  folder: FolderDocument;
  stat: {
    percentageChange: number;
    timeInterval: "hour" | "day";
  };
  numLogsToday: number;
};

export const useInsights = () => {
  const [insightsOfMostCheckedFolders, setInsightsOfMostCheckedFolders] =
    useState<Insight[]>([]);
  const [insightsOfNotMostCheckedFolders, setInsightsOfNotMostCheckedFolders] =
    useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const organization = useSelector(getOrganization);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const res = await Api.organization.getInsights(
        organization!._id.toString()
      );
      const {
        insightsOfMostCheckedFolders: fetchInsightsOfMostCheckedFolders,
        insightsOfNotMostCheckedFolders: fetchedInsightsOfNotMostCheckedFolders,
      } = res.data;
      setInsightsOfMostCheckedFolders(fetchInsightsOfMostCheckedFolders);
      setInsightsOfNotMostCheckedFolders(
        fetchedInsightsOfNotMostCheckedFolders
      );
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (organization) {
      fetchInsights();
    }
  }, [organization?._id]);

  return {
    insightsOfMostCheckedFolders,
    insightsOfNotMostCheckedFolders,
    isLoading,
    refetchInsights: fetchInsights,
  };
};
