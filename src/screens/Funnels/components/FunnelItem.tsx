import { FunnelDocument } from "logtree-types";
import React, { useState } from "react";
import { useFetchFunnels } from "src/redux/actionIndex";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import TrashIcon from "src/assets/redTrash.png";
import Swal from "sweetalert2";
import { showGenericErrorAlert } from "src/utils/helpers";
import { Api } from "src/api";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";
import ArrowDownIcon from "src/assets/arrowDownBlack.png";

type Props = {
  funnel: FunnelDocument;
};

export const FunnelItem = ({ funnel }: Props) => {
  const organization = useSelector(getOrganization);
  const { fetch } = useFetchFunnels();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _handleDeleteFunnel = () =>
    Swal.fire({
      title: "Please confirm",
      text: "Are you sure you want to delete this funnel?",
      icon: "question",
      denyButtonText: "Delete",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
    }).then(async (res) => {
      if (res.isDenied) {
        try {
          setIsLoading(true);
          await Api.organization.deleteFunnel(
            organization!._id.toString(),
            funnel._id.toString()
          );
          await fetch();
        } catch (e) {
          showGenericErrorAlert(e);
        }
        setIsLoading(false);
      }
    });

  return (
    <div style={{ ...styles.container, ...(isLoading && { opacity: 0.4 }) }}>
      <div style={styles.topContainer}>
        <div style={styles.topLeft}>
          <label style={styles.title}>
            Funnel to {funnel.forwardToChannelPath}
          </label>
          <label style={styles.funnelDesc}>
            If logs with the same reference ID pass through the channels below
            in that order from top to bottom, a new log will be sent to{" "}
            {funnel.forwardToChannelPath}. The funnel will be executed a maximum
            of one time per reference ID.
          </label>
        </div>
        <button
          onClick={_handleDeleteFunnel}
          disabled={isLoading}
          style={styles.deleteBtn}
        >
          <img src={TrashIcon} style={styles.icon} />
        </button>
      </div>
      {funnel.folderPathsInOrder.map((folderPath, i) => {
        const shouldHaveArrowAbove = !!i;
        return (
          <>
            {shouldHaveArrowAbove && (
              <img src={ArrowDownIcon} style={styles.arrowDown} />
            )}
            <label style={styles.folderPath}>{folderPath}</label>
          </>
        );
      })}
    </div>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    paddingBottom: 6,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
  },
  icon: {
    width: 22,
    height: 22,
    cursor: "pointer",
  },
  deleteBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
  },
  arrowDown: {
    width: 30,
    height: 30,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
  },
  folderPath: {
    fontSize: 15,
  },
  topLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "75%",
  },
  funnelDesc: {
    fontSize: 13,
    color: Colors.darkerGray,
  },
};
