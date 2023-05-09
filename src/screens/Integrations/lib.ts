import { keyTypeEnum } from "logtree-types";
import { AdditionalPropertyInput } from "./components/ConnectNewIntegration";

export const keyTypePrettyNameMap: { [key in keyTypeEnum]: string } = {
  auth_token: "Auth Token",
  api_key: "API Key",
  secret_key: "Secret Key",
  username: "Username",
  password: "Password",
};

export const formatAdditionalProperties = (
  additionalProperties: AdditionalPropertyInput[]
) => {
  let obj = {};
  additionalProperties.forEach((property) => {
    obj[property.key] = property.value;
  });
  return obj;
};
