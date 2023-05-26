import React, { useState } from "react";
import SlackIcon from "src/assets/slackGrayLogo.png";
import { Colors } from "src/utils/colors";
import { StylesType } from "src/utils/styles";
import { SlackModal } from "./SlackModal";
import { Tooltip } from "antd";

export const ConnectToSlack = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <>
      <SlackModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <Tooltip title="Connect to a Slack channel">
        <button
          onClick={() => setIsModalVisible(true)}
          style={styles.container}
        >
          <img src={SlackIcon} style={styles.slackIcon} />
        </button>
      </Tooltip>
    </>
  );
};

const styles: StylesType = {
  container: {
    outline: "none",
    border: "none",
    backgroundColor: Colors.transparent,
    cursor: "pointer",
    marginLeft: 10,
  },
  slackIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },
};
