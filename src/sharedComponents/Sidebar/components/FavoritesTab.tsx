import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LikeIcon from "src/assets/likeNotFilled.png";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { usePathname } from "src/utils/helpers";
import { StylesType } from "src/utils/styles";

export const FavoritesTab = () => {
  const history = useHistory();
  const organization = useSelector(getOrganization);
  const pathname = usePathname();
  const favoritesPath = `/org/${organization?.slug}/favorites`;
  const isSelected = useMemo(() => {
    return pathname.includes(favoritesPath);
  }, [pathname]);

  const _goToFavorites = () => history.push(favoritesPath);

  return (
    <>
      <button
        style={{
          ...styles.container,
          ...(isSelected && {
            backgroundColor: Colors.lightGray,
            cursor: "default",
          }),
        }}
        onClick={_goToFavorites}
        disabled={isSelected}
        className="tab"
      >
        <div style={styles.innerButtonLeftSide}>
          <img
            src={LikeIcon}
            style={{ ...styles.icon, ...(isSelected && { cursor: "auto" }) }}
          />
          <label
            style={{ ...styles.name, ...(isSelected && { cursor: "auto" }) }}
          >
            My Favorites
          </label>
        </div>
      </button>
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: 33,
    outline: "none",
    border: "none",
    // borderBottomColor: Colors.lightGray,
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    cursor: "pointer",
    paddingLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  name: {
    paddingLeft: 6,
    cursor: "pointer",
    paddingRight: 6,
    fontSize: 14,
    fontWeight: 300,
  },
  innerButtonLeftSide: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};
