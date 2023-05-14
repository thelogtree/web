import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getIntegrations } from "src/redux/organization/selector";

import { IntegrationsToConnectToMap } from "../Integrations/integrationsToConnectTo";
import { useConnectionPathFromUrl } from "../Logs/lib";
import { integrationTypeEnum } from "logtree-types";

export const useCurrentIntegration = () => {
  const connectionPath = useConnectionPathFromUrl();
  const integrations = useSelector(getIntegrations);

  const currentIntegration = useMemo(() => {
    return (
      integrations.find((integration) => integration.type === connectionPath) ??
      null
    );
  }, [integrations.length, connectionPath]);

  const currentIntegrationFromMap = useMemo(() => {
    return currentIntegration
      ? IntegrationsToConnectToMap[currentIntegration.type]
      : null;
  }, [currentIntegration?._id]);

  return {
    currentIntegration,
    currentIntegrationFromMap,
  };
};
