import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { Api } from "src/api";
import { useFetchMe } from "src/redux/actionIndex";
import { getOrganization } from "src/redux/organization/selector";
import { Colors } from "src/utils/colors";
import { showGenericErrorAlert } from "src/utils/helpers";
import { SharedStyles, StylesType } from "src/utils/styles";
import "react-phone-input-2/lib/style.css";

export const VerifyPhone = () => {
  const organization = useSelector(getOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnteringCode, setIsEnteringCode] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const { fetch: refetchUser } = useFetchMe();
  const canSubmitPhoneNumber = phoneNumber.length === 10;
  const prefixedPhoneNumber = "+1" + phoneNumber;

  const _verifyCode = async () => {
    try {
      setIsLoading(true);
      await Api.organization.verifyPhoneCode(
        organization!._id.toString(),
        prefixedPhoneNumber,
        code
      );
      await refetchUser();
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  const _sendCode = async () => {
    try {
      setIsLoading(true);
      await Api.organization.sendPhoneVerificationCode(
        organization!._id.toString(),
        prefixedPhoneNumber
      );
      setIsEnteringCode(true);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.outerContainer}>
      <label style={styles.title}>
        {isEnteringCode
          ? "Enter verification code"
          : "To continue, enter your phone number"}
      </label>
      <label style={styles.description}>
        {isEnteringCode
          ? `We texted a code to ${phoneNumber}.`
          : "We'll text any alerts to this phone number."}
      </label>
      {isEnteringCode ? (
        <div style={styles.innerContainer}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="1234"
            style={styles.codeInput}
          />
          <button
            style={{
              ...styles.phoneActionBtn,
              ...((isLoading || !code) && SharedStyles.loadingButton),
            }}
            onClick={_verifyCode}
            disabled={isLoading || !code}
          >
            {isLoading ? "Loading..." : "Finish"}
          </button>
        </div>
      ) : (
        <div style={styles.innerContainer}>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            country="us"
            inputStyle={styles.phoneInput}
            onlyCountries={["us"]}
            placeholder="(444) 444-4444"
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
              focus: true,
            }}
            disableDropdown={false}
            showDropdown={false}
            disableCountryCode={true}
          />
          <button
            style={{
              ...styles.phoneActionBtn,
              ...((isLoading || !canSubmitPhoneNumber) &&
                SharedStyles.loadingButton),
            }}
            onClick={_sendCode}
            disabled={isLoading || !canSubmitPhoneNumber}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
      )}
      {isEnteringCode ? (
        <button
          style={styles.enterDifferentNumber}
          onClick={() => setIsEnteringCode(false)}
          disabled={isLoading}
        >
          Enter different phone number
        </button>
      ) : null}
    </div>
  );
};

const styles: StylesType = {
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 35,
    width: "100%",
    marginTop: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 12,
  },
  phoneInput: {
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    fontSize: 16,
    width: 200,
  },
  codeInput: {
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    fontSize: 16,
    width: 200,
    backgroundColor: Colors.transparent,
    borderRadius: 4,
    borderWidth: 1,
    paddingLeft: 6,
    paddingTop: 3,
    paddingBottom: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  description: {
    color: Colors.darkGray,
    fontSize: 13,
  },
  phoneActionBtn: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: Colors.gray,
    borderWidth: 1,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 5,
    paddingBottom: 5,
    cursor: "pointer",
    minWidth: 100,
    marginLeft: 12,
  },
  enterDifferentNumber: {
    fontSize: 12,
    color: Colors.gray,
    textDecoration: "underline",
    cursor: "pointer",
    backgroundColor: Colors.transparent,
    border: "none",
    outline: "none",
    position: "relative",
    right: 4,
    marginTop: 8,
  },
};
