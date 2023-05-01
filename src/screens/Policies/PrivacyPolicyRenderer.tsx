import React from "react";
import { PrivacyPolicyPiece } from "./PrivacyPolicyPiece";
const template = { __html: PrivacyPolicyPiece };

export const PrivacyPolicyRenderer = () => (
  <div dangerouslySetInnerHTML={template} style={{ overflowY: "scroll" }} />
);
