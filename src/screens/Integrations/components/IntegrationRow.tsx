import { IntegrationDocument } from "logtree-types";
import React, { useState } from "react";
import { Api } from "src/api";
import { useFetchIntegrations } from "src/redux/actionIndex";
import { showGenericErrorAlert } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";
import TrashIcon from "src/assets/redTrash.png";
import Swal from "sweetalert2";
import { Colors } from "src/utils/colors";
import { IntegrationsToConnectToMap } from "../integrationsToConnectTo";

type Props = {
  integration: IntegrationDocument;
  isFirst: boolean;
};

export const IntegrationRow = ({ integration, isFirst }: Props) => {
  const integrationDisplayDetails =
    IntegrationsToConnectToMap[integration.type];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch: refetchIntegrations } = useFetchIntegrations();

  const _handleDelete = async () => {
    const alertRes = await Swal.fire({
      title: "Please confirm",
      text: `Are you sure you want to disconnect ${integrationDisplayDetails.prettyName}? You can re-add it later if you want.`,
      icon: "question",
      denyButtonText: "Delete",
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      showConfirmButton: false,
    });
    if (alertRes.isDenied && !isLoading) {
      try {
        setIsLoading(true);
        await Api.organization.deleteIntegration(
          integration.organizationId.toString(),
          integration._id.toString()
        );
        await refetchIntegrations();
      } catch (e) {
        showGenericErrorAlert(e);
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(isLoading && { opacity: 0.4 }),
        ...(isFirst && { border: "none" }),
      }}
    >
      <div style={styles.leftSide}>
        <img
          src={integrationDisplayDetails.image}
          style={styles.integrationIcon}
        />
        <label style={styles.name}>
          {integrationDisplayDetails.prettyName}
        </label>
      </div>
      <button
        style={{ ...styles.deleteBtn, ...(isLoading && { cursor: "default" }) }}
        onClick={_handleDelete}
        disabled={isLoading}
      >
        <img src={TrashIcon} style={styles.trashIcon} />
      </button>
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    width: "100%",
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
    borderTopStyle: "solid",
  },
  leftSide: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 30,
  },
  integrationIcon: {
    maxWidth: 25,
    maxHeight: 25,
  },
  name: {
    fontSize: 17,
    fontWeight: 500,
    paddingLeft: 12,
  },
  trashIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  deleteBtn: {
    outline: "none",
    cursor: "pointer",
    border: "none",
    backgroundColor: Colors.transparent,
    marginRight: 30,
  },
};
