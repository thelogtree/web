import segmentPlugin from "@analytics/segment";
import Analytics from "analytics";

export const MySegment = Analytics({
  plugins: [
    segmentPlugin({
      writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY,
    }),
  ],
});

export enum SegmentEventsEnum {
  ClickedSendInviteButton = "Clicked Send Invite Button",
  ClickedDiagnoseProblemButton = "Clicked Diagnose Problem Button",
}
