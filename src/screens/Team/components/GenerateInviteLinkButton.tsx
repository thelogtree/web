import { orgPermissionLevel } from "logtree-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getOrganization, getUser } from "src/redux/organization/selector";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { MySegment, SegmentEventsEnum } from "src/utils/segmentClient";
import { StylesType } from "src/utils/styles";
import Swal from "sweetalert2";

export const GenerateInviteLinkButton = () => {
  const user = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const isOrgAdmin = user?.orgPermissionLevel === orgPermissionLevel.Admin;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _generateInviteLink = async () => {
    try {
      if (!isOrgAdmin) {
        showGenericErrorAlert({
          message:
            "You must be an admin to be able to invite other people to this organization.",
        });
        return;
      }
      setIsLoading(true);
      const res = await Api.organization.generateInviteLink(
        organization!._id.toString()
      );
      const { url } = res.data;
      MySegment.track(SegmentEventsEnum.ClickedSendInviteButton, {
        organization: organization?.slug,
      });
      Swal.fire({
        width: 800,
        html: `<h2 style="padding-top: 15px;">Here's a new invite link</h3><p style="text-align: left; padding-top: 12px;">Send this link to the person you want to invite to ${organization?.name}. This link will expire once it gets used or after 24 hours if it's never used.</p><a href={${url}} style="color: rgb(50,50,50);">${url}</a>`,
      });
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={_generateInviteLink}
      disabled={isLoading}
      style={{ ...styles.container, ...(isLoading && styles.loadingButton) }}
    >
      {isLoading ? (
        <LoadingSpinner size={20} color={Colors.black} />
      ) : (
        <label
          style={{
            ...styles.inviteMemberLbl,
            ...(isLoading ? { cursor: "default" } : {}),
          }}
        >
          Send invite
        </label>
      )}
    </button>
  );
};

const styles: StylesType = {
  container: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.white,
    color: Colors.black,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    width: 122,
    cursor: "pointer",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.black,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inviteMemberLbl: {
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
};
