import React from "react";
import DashboardIcon from "src/assets/dashboardIcon.png";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { useNavigateToDashboardIfLost } from "src/screens/Dashboard/lib";

export const DashboardTab = () => {
  const { navigateIfLost } = useNavigateToDashboardIfLost(true);

  return (
    <>
      <button style={styles.container} onClick={navigateIfLost} className="tab">
        <div style={styles.innerButtonLeftSide}>
          <img src={DashboardIcon} style={styles.icon} />
          <label style={styles.name}>
            Dashboards <span style={styles.beta}>beta</span>
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
  newLogsTag: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 10,
    textAlign: "center",
    marginLeft: 6,
    color: Colors.gray,
  },
  beta: {
    background: "linear-gradient(268.45deg, #383838 30.54%, #404040 60.79%)",
    color: Colors.white,
    marginLeft: 12,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 11,
    borderRadius: 40,
    fontWeight: 500,
  },
};
