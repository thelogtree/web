import { WidgetDocument } from "logtree-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { useFetchWidgetsWithData } from "src/redux/actionIndex";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";
import TrashIcon from "src/assets/redTrash.png";
import Swal from "sweetalert2";

type Props = {
  isVisible: boolean;
  widget: WidgetDocument;
};

export const DeleteWidgetButton = ({ widget, isVisible }: Props) => {
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch } = useFetchWidgetsWithData();

  const _handleDelete = (event) => {
    event.stopPropagation();
    Swal.fire({
      title: "Please confirm",
      text: `Are you sure you want to delete this widget?`,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "Delete",
    }).then(async (res) => {
      if (res.isDenied) {
        try {
          setIsLoading(true);
          await Api.organization.deleteWidget(
            organization!._id.toString(),
            widget._id.toString()
          );
          await fetch();
        } catch (e) {
          showGenericErrorAlert(e);
        }
        setIsLoading(false);
      }
    });
  };

  return isVisible ? (
    <button
      style={{
        ...styles.container,
        ...(isLoading && SharedStyles.loadingButton),
      }}
      disabled={isLoading}
      onClick={_handleDelete}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <img src={TrashIcon} style={styles.trash} />
    </button>
  ) : null;
};

const styles: StylesType = {
  container: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
    position: "absolute",
    top: 26,
    right: 21,
    zIndex: 70,
  },
  trash: {
    cursor: "pointer",
    width: 20,
    height: 20,
  },
};
