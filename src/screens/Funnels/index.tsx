import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useFetchFunnels } from "src/redux/actionIndex";
import { getFunnels, getOrganization } from "src/redux/organization/selector";
import { StylesType } from "src/utils/styles";
import { FunnelItem } from "./components/FunnelItem";
import { CreateNewFunnel } from "./components/CreateNewFunnel";
import { Colors } from "src/utils/colors";
import { LoadingSpinnerFullScreen } from "src/sharedComponents/LoadingSpinnerFullScreen";

export const FunnelsScreen = () => {
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
    <div style={styles.container}>
      <label style={styles.title}>Create new funnel</label>
      <CreateNewFunnel />
      <hr style={styles.hr} />
      {funnels.length ? <label style={styles.title}>My funnels</label> : null}
      {funnels.map((funnel) => (
        <FunnelItem funnel={funnel} />
      ))}
    </div>
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
    paddingBottom: 30,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    height: 1,
    border: "none",
    marginBottom: 24,
    marginTop: 20,
  },
};
