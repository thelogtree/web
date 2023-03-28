import { Select } from "antd";
import { UserDocument, orgPermissionLevel } from "logtree-types";
import { userInfo } from "os";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getOrganization, getUser } from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import TrashIcon from "src/assets/trash.png";
import Swal from "sweetalert2";
import { Colors } from "src/utils/colors";
import { useFetchOrganizationMembers } from "src/redux/actionIndex";
import { LoadingSpinner } from "src/sharedComponents/LoadingSpinner";

type Props = {
  member: UserDocument;
  isFirst: boolean;
};

export const MemberRow = ({ member, isFirst }: Props) => {
  const me = useSelector(getUser);
  const organization = useSelector(getOrganization);
  const isMe = me?._id.toString() === member._id.toString();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch } = useFetchOrganizationMembers();
  const [permissionLevel, setPermissionLevel] = useState<orgPermissionLevel>(
    member.orgPermissionLevel
  );
  const iAmOrgAdmin = me?.orgPermissionLevel === orgPermissionLevel.Admin;

  const _updatePermissions = async (isRemoved?: boolean) => {
    try {
      if (!isRemoved && permissionLevel === member.orgPermissionLevel) {
        return;
      }
      setIsLoading(true);
      await Api.organization.updateUserPermissions(
        organization!._id.toString(),
        member._id.toString(),
        permissionLevel,
        isRemoved
      );
      await fetch();
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _remove = async () => {
    const res = await Swal.fire({
      title: "Please confirm",
      text: `Are you sure you want to remove ${member.email} from ${organization?.name}?`,
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: "Remove",
      cancelButtonText: "Cancel",
    });
    if (res.isDenied) {
      _updatePermissions(true);
    }
  };

  useEffect(() => {
    _updatePermissions();
  }, [permissionLevel]);

  return (
    <div style={{ ...styles.container, ...(isFirst && { borderTop: "none" }) }}>
      <div style={styles.leftContainer}>
        <label style={styles.memberEmail}>
          {member.email}
          {isMe ? " (You)" : ""}
        </label>
      </div>
      <div style={styles.rightContainer}>
        {isLoading ? (
          <LoadingSpinner
            size={20}
            style={{ marginRight: 20 }}
            color={Colors.gray}
          />
        ) : null}
        <Select
          defaultValue={permissionLevel}
          value={permissionLevel}
          style={{ width: 120 }}
          onChange={(val) => setPermissionLevel(val)}
          options={[
            { value: orgPermissionLevel.Admin, label: "Admin" },
            { value: orgPermissionLevel.Member, label: "Member" },
          ]}
          disabled={!iAmOrgAdmin || isLoading || isMe}
          showArrow={!isMe || !iAmOrgAdmin}
        />
        {iAmOrgAdmin && !isMe ? (
          <button
            onClick={_remove}
            disabled={!iAmOrgAdmin || isLoading}
            style={styles.trashBtn}
          >
            <img src={TrashIcon} style={styles.trashIcon} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
    borderTopStyle: "solid",
  },
  memberEmail: {
    fontSize: 15,
  },
  leftContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rightContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  trashIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  trashBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
    marginLeft: 20,
  },
};
