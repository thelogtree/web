import { keyTypeEnum } from "logtree-types";

export const keyTypePrettyNameMap: { [key in keyTypeEnum]: string } = {
  auth_token: "Auth Token",
  api_key: "API Key",
  secret_key: "Secret Key",
};
