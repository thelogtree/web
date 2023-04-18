import { InputNumber, Modal, Select } from "antd";
import { comparisonTypeEnum } from "logtree-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { getOrganization, getRules } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";
import {
  useFindFrontendFolderFromUrl,
  useIsFavoriteLogsScreen,
  useIsGlobalSearchScreen,
} from "../lib";
import { useFetchMyRules } from "src/redux/actionIndex";
import { ExistingRule } from "./ExistingRule";

export enum lookbackTimeUnitEnum {
  Minutes = 1,
  Hours = 60,
  Days = 1440,
  Weeks = 10080,
}

export const Rules = () => {
  const organization = useSelector(getOrganization);
  const frontendFolder = useFindFrontendFolderFromUrl();
  const rules = useSelector(getRules);
  const rulesForThisFolder = rules.filter(
    (r) => r.folderId.toString() === frontendFolder?._id.toString()
  );
  const isFavoritesScreen = useIsFavoriteLogsScreen();
  const isGlobalSearchScreen = useIsGlobalSearchScreen();
  const { fetch: fetchRules } = useFetchMyRules();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [comparisonType, setComparisonType] = useState<comparisonTypeEnum>(
    comparisonTypeEnum.CrossesAbove
  );
  const [comparisonValue, setComparisonValue] = useState<number | null>(null);
  const [lookbackTime, setLookbackTime] = useState<number | null>(null);
  const [lookbackTimeUnitType, setLookbackTimeUnitType] =
    useState<lookbackTimeUnitEnum>(lookbackTimeUnitEnum.Hours);

  const _resetInputs = () => {
    setComparisonValue(100);
    setLookbackTimeUnitType(lookbackTimeUnitEnum.Hours);
    setLookbackTime(24);
    setComparisonType(comparisonTypeEnum.CrossesAbove);
  };

  const _createAlert = async () => {
    try {
      if (comparisonValue === null || lookbackTime === null) {
        throw new Error("Please fill in all the details.");
      }
      if (isNaN(comparisonValue) || isNaN(lookbackTime)) {
        throw new Error("Not all of the numerical fields are valid.");
      }
      if (
        lookbackTime < 20 &&
        lookbackTimeUnitType === lookbackTimeUnitEnum.Minutes
      ) {
        throw new Error(
          "The shortest timeframe you can specify is 20 minutes."
        );
      }
      setIsLoading(true);

      await Api.organization.createRule(
        organization!._id.toString(),
        frontendFolder!._id.toString(),
        comparisonType,
        comparisonValue,
        lookbackTime * lookbackTimeUnitType
      );
      await fetchRules();
      _resetInputs();
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    _resetInputs();
  }, [frontendFolder?._id]);

  if (isFavoritesScreen || isGlobalSearchScreen) {
    return null;
  }

  return (
    <>
      <Modal
        open={isModalVisible}
        footer={null}
        style={styles.modalContainer}
        width={1100}
        onCancel={() => setIsModalVisible(false)}
      >
        <div style={styles.createNewAlertContainer}>
          <label style={styles.subtitle}>Create new alert</label>
          <label style={styles.delayNote}>
            Note that there may be an up to 20 minute delay from the time your
            alert triggers to the time you receive an email.
          </label>
          <hr style={styles.hr} />
          <div style={styles.innerNewAlertContainer}>
            <label style={styles.emailMeCondition}>
              Email me if the number of logs in the last{" "}
            </label>
            <InputNumber
              min={1}
              max={1000}
              value={lookbackTime}
              onChange={(val) => setLookbackTime(val)}
              disabled={isLoading}
              style={styles.lookbackValue}
            />
            <Select
              value={lookbackTimeUnitType}
              style={styles.lookbackUnits}
              onChange={(val) => setLookbackTimeUnitType(val)}
              options={[
                { value: lookbackTimeUnitEnum.Minutes, label: "minutes" },
                { value: lookbackTimeUnitEnum.Hours, label: "hours" },
                { value: lookbackTimeUnitEnum.Days, label: "days" },
                { value: lookbackTimeUnitEnum.Weeks, label: "weeks" },
              ]}
              disabled={isLoading}
            />
            <Select
              value={comparisonType}
              style={styles.comparisonType}
              onChange={(val) => setComparisonType(val)}
              options={[
                { value: comparisonTypeEnum.CrossesAbove, label: "exceeds" },
                {
                  value: comparisonTypeEnum.CrossesBelow,
                  label: "drops below",
                },
              ]}
              disabled={isLoading}
            />
            <InputNumber
              min={0}
              max={1000000}
              value={comparisonValue}
              onChange={(val) => setComparisonValue(val)}
              disabled={isLoading}
            />
            <button
              style={{
                ...styles.saveBtn,
                ...(isLoading && SharedStyles.loadingButton),
              }}
              onClick={_createAlert}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
          {rulesForThisFolder.length ? (
            <>
              <label style={{ ...styles.subtitle, paddingTop: 60 }}>
                My alerts ({rulesForThisFolder.length})
              </label>
              <hr style={styles.hr} />
              {rulesForThisFolder.map((rule) => (
                <ExistingRule rule={rule} key={rule._id.toString()} />
              ))}
            </>
          ) : null}
        </div>
      </Modal>
      <button
        style={styles.rulesBtn}
        onClick={() => setIsModalVisible(true)}
        className="createRuleBtn"
      >
        {rulesForThisFolder.length
          ? `Alerts (${rulesForThisFolder.length})`
          : "Create alert"}
      </button>
    </>
  );
};

const styles: StylesType = {
  rulesBtn: {
    cursor: "pointer",
    fontSize: 13,
    letterSpacing: 0.8,
    color: Colors.gray,
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    marginRight: 10,
  },
  modalContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    letterSpacing: "normal",
  },
  createNewAlertContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 600,
  },
  innerNewAlertContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  saveBtn: {
    outline: "none",
    border: "none",
    cursor: "pointer",
    backgroundColor: Colors.white,
    marginLeft: 16,
    borderRadius: 8,
    color: Colors.black,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 4,
    paddingBottom: 4,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  emailMeCondition: {
    paddingRight: 10,
    color: Colors.darkGray,
  },
  lookbackUnits: {
    width: 120,
    marginRight: 5,
  },
  comparisonType: {
    width: 120,
    marginRight: 5,
  },
  lookbackValue: {
    marginRight: 5,
  },
  hr: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    height: 1,
    border: "none",
    marginBottom: 10,
    marginTop: 8,
  },
  delayNote: {
    color: Colors.darkGray,
    fontSize: 12,
  },
};
