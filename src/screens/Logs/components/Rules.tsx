import { InputNumber, Modal, Select } from "antd";
import { comparisonTypeEnum, notificationTypeEnum } from "logtree-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { useFetchMyRules } from "src/redux/actionIndex";
import {
  getOrganization,
  getRules,
  getUser,
} from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";
import AlarmIcon from "src/assets/alarm.png";

import {
  useFindFrontendFolderFromUrl,
  useIsFavoriteLogsScreen,
  useIsGlobalSearchScreen,
} from "../lib";
import { ExistingRule } from "./ExistingRule";
import { VerifyPhone } from "./VerifyPhone";

export enum lookbackTimeUnitEnum {
  Minutes = 1,
  Hours = 60,
  Days = 1440,
  Weeks = 10080,
}

type Props = {
  shouldHideEverything: boolean;
};

export const Rules = ({ shouldHideEverything }: Props) => {
  const organization = useSelector(getOrganization);
  const frontendFolder = useFindFrontendFolderFromUrl();
  const rules = useSelector(getRules);
  const user = useSelector(getUser);
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
  const [notificationType, setNotificationType] =
    useState<notificationTypeEnum>(notificationTypeEnum.Email);
  const choseSmsNotificationTypeButUserHasNoPhoneNumber =
    notificationType === notificationTypeEnum.SMS && !user?.phoneNumber;

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
      if (choseSmsNotificationTypeButUserHasNoPhoneNumber) {
        throw new Error("Please provide your phone number first.");
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
        lookbackTime * lookbackTimeUnitType,
        notificationType
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

  if (isFavoritesScreen || isGlobalSearchScreen || shouldHideEverything) {
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
          <label style={styles.subtitle}>Set up alerts</label>
          <label style={styles.delayNote}>
            Note that there may be an up to 20 minute delay from the time your
            alert trigger conditions are met to the time you actually receive an
            alert.
          </label>
          <hr style={styles.hr} />
          {choseSmsNotificationTypeButUserHasNoPhoneNumber ? (
            <VerifyPhone />
          ) : null}
          <div style={styles.innerNewAlertContainer}>
            <label style={styles.emailMeCondition}>
              <Select
                value={notificationType}
                style={styles.notificationType}
                onChange={(val) => setNotificationType(val)}
                options={[
                  {
                    value: notificationTypeEnum.Email,
                    label: "Email",
                  },
                  {
                    value: notificationTypeEnum.SMS,
                    label: "Text",
                  },
                ]}
                disabled={isLoading}
              />{" "}
              me if the number of logs in the last{" "}
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
                {
                  value: comparisonTypeEnum.CrossesAbove,
                  label: "crosses above",
                },
                {
                  value: comparisonTypeEnum.CrossesBelow,
                  label: "crosses below",
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
                ...((isLoading ||
                  choseSmsNotificationTypeButUserHasNoPhoneNumber) &&
                  SharedStyles.loadingButton),
              }}
              onClick={_createAlert}
              disabled={
                isLoading || choseSmsNotificationTypeButUserHasNoPhoneNumber
              }
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
        <img src={AlarmIcon} style={styles.alarmIcon} />
        <label style={styles.alertLbl}>
          {rulesForThisFolder.length
            ? `Alerts (${rulesForThisFolder.length})`
            : "Set up alerts"}
        </label>
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
    minWidth: 130,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    width: 160,
    marginRight: 5,
  },
  notificationType: {
    width: 100,
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
  alarmIcon: {
    cursor: "pointer",
    width: 17,
    height: 17,
  },
  alertLbl: {
    color: Colors.gray,
    marginLeft: 6,
    cursor: "pointer",
  },
};
