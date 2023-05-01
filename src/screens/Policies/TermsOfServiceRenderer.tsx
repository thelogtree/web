import React from "react";
import { TermsOfServicePiece } from "./TermsOfServicePiece";
const template = { __html: TermsOfServicePiece };

export const TermsOfServiceRenderer = () => (
  <div dangerouslySetInnerHTML={template} style={{ overflowY: "scroll" }} />
);
