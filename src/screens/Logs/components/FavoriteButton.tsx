import React, { useEffect, useState } from "react";
import { useFullFolderPathFromUrl } from "../lib";
import LikeNotFilledIcon from "src/assets/likeNotFilled.png";
import LikeFilledIcon from "src/assets/likeFilled.png";
import { StylesType } from "src/utils/styles";
import { Colors } from "src/utils/colors";
import { useFetchFavoriteFolderPaths } from "src/redux/actionIndex";
import { useSelector } from "react-redux";
import {
  getFavoriteFolderPaths,
  getOrganization,
} from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import { Api } from "src/api";
import { Tooltip } from "antd";

export const getIsFavoritedOnBackend = (
  favoritedPaths: string[],
  currentFullPath: string
) =>
  !!favoritedPaths.find(
    (favoritedPath) => currentFullPath.indexOf(favoritedPath) === 0
  );

export const FavoriteButton = () => {
  const organization = useSelector(getOrganization);
  const { fetch } = useFetchFavoriteFolderPaths();
  const fullFolderPath = useFullFolderPathFromUrl();
  const favoritedPaths = useSelector(getFavoriteFolderPaths);
  const [isFavorited, setIsFavorited] = useState<boolean>(
    getIsFavoritedOnBackend(favoritedPaths, fullFolderPath)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _handleFlipFavorite = async () => {
    try {
      if (
        isFavorited === getIsFavoritedOnBackend(favoritedPaths, fullFolderPath)
      ) {
        return;
      }
      setIsLoading(true);
      await Api.organization.favoriteFolderPath(
        organization!._id.toString(),
        fullFolderPath,
        !isFavorited
      );
      await fetch();
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    _handleFlipFavorite();
  }, [isFavorited]);

  useEffect(() => {
    setIsFavorited(getIsFavoritedOnBackend(favoritedPaths, fullFolderPath));
  }, [fullFolderPath, favoritedPaths.length]);

  return (
    <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
      <button
        style={styles.container}
        disabled={isLoading}
        onClick={() => setIsFavorited(!isFavorited)}
      >
        <img
          src={isFavorited ? LikeFilledIcon : LikeNotFilledIcon}
          style={styles.favoriteIcon}
        />
      </button>
    </Tooltip>
  );
};

const styles: StylesType = {
  container: {
    cursor: "pointer",
    backgroundColor: Colors.transparent,
    outline: "none",
    border: "none",
  },
  favoriteIcon: {
    cursor: "pointer",
    width: 20,
    height: 20,
  },
};
