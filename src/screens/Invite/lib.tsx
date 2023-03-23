import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Api } from "src/api";
import { showGenericErrorAlert } from "src/utils/helpers";
import React from "react";

type InvitationInfo = {
  numMembers: number;
  organizationName: string;
  organizationId: string;
};

export const useInvitationInfo = () => {
  const [invitationInfo, setInvitationInfo] = useState<InvitationInfo | null>(
    null
  );
  const [isFetchingInvitationInfo, setIsFetchingInvitationInfo] =
    useState<boolean>(true);
  const params = useParams() as any;
  const { slug, id } = params;

  const _fetchInvitationInfo = async () => {
    try {
      if (!slug || !id) {
        return;
      }
      setIsFetchingInvitationInfo(true);
      const res = await Api.organization.getInvitationInfo(slug, id);
      setInvitationInfo(res.data);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsFetchingInvitationInfo(false);
  };

  useEffect(() => {
    _fetchInvitationInfo();
  }, [slug, id]);

  return { invitationInfo, isFetchingInvitationInfo };
};

export const orgJoiningTextOnInviteScreen = (
  organizationName?: string,
  numMembers?: number
) => {
  if (
    typeof organizationName === "undefined" ||
    typeof numMembers === "undefined"
  ) {
    return "";
  } else if (numMembers === 0) {
    return `Finish joining ${organizationName}`;
  } else if (numMembers === 1) {
    return `Finish joining 1 other member on ${organizationName}`;
  }
  return `Finish joining ${numMembers} other members on ${organizationName}`;
};
