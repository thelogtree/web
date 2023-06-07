import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFetchFunnels } from "src/redux/actionIndex";
import { getFunnels, getOrganization } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";
import { FunnelItem } from "./components/FunnelItem";
import { CreateNewFunnel } from "./components/CreateNewFunnel";
import { Colors } from "src/utils/colors";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";

export const FunnelsScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const organization = useSelector(getOrganization);
  const funnels = useSelector(getFunnels);
  const { fetch, isFetching } = useFetchFunnels(true);

  useEffect(() => {
    if (organization) {
      fetch();
    }
  }, [organization?._id]);

  if (isFetching) {
    return <LoadingSpinnerFullScreen />;
  }

  return (
    <>
      <CreateNewFunnel
        isModalVisible={isModalOpen}
        setIsModalVisible={setIsModalOpen}
      />
      <div style={styles.container}>
        <div style={styles.topContainer}>
          <label style={styles.title}>My funnels</label>
          <button style={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            Create funnel
          </button>
        </div>
        {funnels.length ? null : (
          <label style={styles.noFunnelsLbl}>You have no active funnels.</label>
        )}
        {funnels.map((funnel) => (
          <FunnelItem funnel={funnel} />
        ))}
      </div>
    </>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    padding: 90,
    overflowY: "scroll",
  },
  title: {
    fontWeight: 600,
    fontSize: 30,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    height: 1,
    border: "none",
    marginBottom: 24,
    marginTop: 20,
  },
  addBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.white,
    color: Colors.black,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    cursor: "pointer",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.black,
    fontWeight: 500,
    fontSize: 14,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    width: "100%",
  },
  noFunnelsLbl: {
    color: Colors.darkGray,
  },
};
