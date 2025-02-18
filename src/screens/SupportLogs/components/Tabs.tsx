import React from "react";
import { useSelector } from "react-redux";
import { getUser } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { MySegment, SegmentEventsEnum } from "src/utils/segmentClient";
import { StylesType } from "src/utils/styles";

export enum tabKeys {
  Timeline = "timeline",
  Requests = "requests",
  Marketing = "marketing",
  Errors = "errors",
  Support = "support",
  UserDetails = "user_details",
}

type Props = {
  onSelectTab: (tab_key: tabKeys) => void;
  selectedTabKey: tabKeys;
};

const IndividualTab = ({
  title,
  tabKey,
  onSelectTab,
  selectedTabKey,
}: {
  title: string;
  tabKey: tabKeys;
  onSelectTab: (tab_key: tabKeys) => void;
  selectedTabKey: tabKeys;
}) => {
  const user = useSelector(getUser);
  const isSelected = tabKey === selectedTabKey;
  const _select = () => {
    onSelectTab(tabKey);
    MySegment.track(SegmentEventsEnum.ClickedTab, {
      tab: tabKey,
      title,
      user_email: user?.email,
    });
  };

  return (
    <button
      onClick={_select}
      disabled={isSelected}
      style={{
        ...styles.tab,
        ...(isSelected ? styles.selectedTab : { borderBottom: "none" }),
      }}
    >
      {title}
    </button>
  );
};

export const Tabs = ({ onSelectTab, selectedTabKey }: Props) => (
  <div style={styles.outerContainer}>
    <div style={styles.container}>
      <IndividualTab
        title="Full Timeline"
        tabKey={tabKeys.Timeline}
        onSelectTab={onSelectTab}
        selectedTabKey={selectedTabKey}
      />
      <IndividualTab
        title="Requests"
        tabKey={tabKeys.Requests}
        onSelectTab={onSelectTab}
        selectedTabKey={selectedTabKey}
      />
      <IndividualTab
        title="Errors"
        tabKey={tabKeys.Errors}
        onSelectTab={onSelectTab}
        selectedTabKey={selectedTabKey}
      />
      <IndividualTab
        title="Support"
        tabKey={tabKeys.Support}
        onSelectTab={onSelectTab}
        selectedTabKey={selectedTabKey}
      />
      <IndividualTab
        title="Marketing"
        tabKey={tabKeys.Marketing}
        onSelectTab={onSelectTab}
        selectedTabKey={selectedTabKey}
      />
      <IndividualTab
        title="User Details"
        tabKey={tabKeys.UserDetails}
        onSelectTab={onSelectTab}
        selectedTabKey={selectedTabKey}
      />
    </div>
  </div>
);

const styles: StylesType = {
  outerContainer: {
    width: "100%",
    paddingBottom: 30,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: Colors.lightGray,
  },
  tab: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    color: Colors.black,
    fontWeight: 300,
    backgroundColor: Colors.transparent,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 14,
    paddingTop: 14,
  },
  selectedTab: {
    borderBottomColor: Colors.black,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    fontWeight: 500,
  },
};
