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
};

export const useInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const organization = useSelector(getOrganization);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const res = await Api.organization.getInsights(
        organization!._id.toString()
      );
      const { insights: fetchedInsights } = res.data;
      setInsights(fetchedInsights);
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

  return { insights, isLoading, refetchInsights: fetchInsights };
};
