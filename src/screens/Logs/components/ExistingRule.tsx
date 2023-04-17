import { RuleDocument, comparisonTypeEnum } from "logtree-types";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { useFetchMyRules } from "src/redux/actionIndex";
import { getOrganization } from "src/redux/organization/selector";
import { showGenericErrorAlert } from "src/utils/helpers";
import { lookbackTimeUnitEnum } from "./Rules";
import { SharedStyles, StylesType } from "src/utils/styles";
import TrashIcon from "src/assets/redTrash.png";
import { Colors } from "src/utils/colors";

type Props = {
  rule: RuleDocument;
};

const convertToCleanestTimeCombo = (
  mins: number
): { value: number; type: string } => {
  if (!mins) {
    return { value: 0, type: "minute" };
  } else if (mins % lookbackTimeUnitEnum.Weeks === 0) {
    const result = mins / lookbackTimeUnitEnum.Weeks;
    return {
      value: result,
      type: result === 1 ? "week" : "weeks",
    };
  } else if (mins % lookbackTimeUnitEnum.Days === 0) {
    const result = mins / lookbackTimeUnitEnum.Days;
    return {
      value: result,
      type: result === 1 ? "day" : "days",
    };
  } else if (mins % lookbackTimeUnitEnum.Hours === 0) {
    const result = mins / lookbackTimeUnitEnum.Hours;
    return {
      value: result,
      type: result === 1 ? "hour" : "hours",
    };
  }
  return {
    value: mins,
    type: mins === 1 ? "minute" : "minutes",
  };
};

export const ExistingRule = ({ rule }: Props) => {
  const organization = useSelector(getOrganization);
  const { fetch } = useFetchMyRules();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { value, type } = useMemo(() => {
    return convertToCleanestTimeCombo(rule.lookbackTimeInMins);
  }, [rule.lookbackTimeInMins]);

  const _deleteRule = async () => {
    try {
      setIsLoading(true);
      await Api.organization.deleteRule(
        organization!._id.toString(),
        rule._id.toString()
      );
      await fetch();
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.ruleContainer}>
      <label>
        Email me if the number of logs in the last
        {value === 1 ? "" : ` ${value}`} {type}{" "}
        {rule.comparisonType === comparisonTypeEnum.CrossesAbove
          ? "exceeds"
          : "drops below"}{" "}
        {rule.comparisonValue}
      </label>
      <button
        style={{
          ...styles.deleteRuleBtn,
          ...(isLoading && SharedStyles.loadingButton),
        }}
        disabled={isLoading}
        onClick={_deleteRule}
      >
        <img src={TrashIcon} style={styles.trashIcon} />
        <label style={styles.deleteBtnText}>Delete</label>
      </button>
    </div>
  );
};

const styles: StylesType = {
  ruleContainer: {
    marginBottom: 9,
    borderRadius: 8,
    padding: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    color: Colors.darkGray,
  },
  trashIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
  deleteRuleBtn: {
    cursor: "pointer",
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
  },
  deleteBtnText: {
    color: Colors.red,
    paddingLeft: 5,
    cursor: "pointer",
  },
};
