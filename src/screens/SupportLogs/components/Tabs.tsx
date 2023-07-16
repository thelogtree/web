import React from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";

export enum tabKeys {
  Timeline = "timeline",
  Requests = "requests",
  Marketing = "marketing",
  Errors = "errors",
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
  const isSelected = tabKey === selectedTabKey;
  const _select = () => onSelectTab(tabKey);

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
        title="Timeline"
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
    fontWeight: 400,
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
  },
};
