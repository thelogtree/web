import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { useCurrentIntegration } from "../lib";
import { showGenericErrorAlert } from "src/utils/helpers";
import { Api } from "src/api";
import { useSelector } from "react-redux";
import { getOrganization } from "src/redux/organization/selector";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const AskQuestionGetResponseModal = ({
  isVisible,
  setIsVisible,
}: Props) => {
  const organization = useSelector(getOrganization);
  const { currentIntegration, currentIntegrationFromMap } =
    useCurrentIntegration();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    if (!isVisible) {
      setQuestion("");
      setResponse("");
    }
  }, [isVisible]);

  const _askQuestion = async () => {
    try {
      setIsLoading(true);
      const res = await Api.organization.askQuestion(
        organization!._id.toString(),
        currentIntegration!._id.toString(),
        question
      );
      const fetchedResponse = res.data.response;
      setResponse(fetchedResponse);
    } catch (e) {
      showGenericErrorAlert(e);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      width={600}
      onCancel={() => setIsVisible(false)}
      onOk={_askQuestion}
      okButtonProps={{ disabled: isLoading }}
      okText={isLoading ? "Asking..." : "Ask question"}
      closable={false}
      open={isVisible}
    >
      <div style={styles.container}>
        <label style={styles.title}>
          Ask a question about your {currentIntegrationFromMap?.prettyName} data
        </label>
        <label style={styles.desc}>
          Please note that the AI's response will only be based on your recent
          data.
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Your question"
          style={styles.questionInput}
        />
        {response ? (
          <label style={styles.responseText}>{response}</label>
        ) : null}
      </div>
    </Modal>
  );
};

const styles: StylesType = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  questionInput: {
    width: "100%",
    padding: 12,
    border: "none",
    outline: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: Colors.white,
  },
  responseText: {
    width: "100%",
    padding: 12,
    border: "none",
    outline: "none",
    borderStyle: "solid",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  desc: {
    fontSize: 13,
    color: Colors.darkerGray,
    paddingTop: 8,
    paddingBottom: 20,
  },
};
