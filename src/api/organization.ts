import {
  IntegrationDocument,
  comparisonTypeEnum,
  integrationTypeEnum,
  notificationTypeEnum,
  orgPermissionLevel,
} from "logtree-types";
import axios from "../utils/axios";
import moment from "moment";
import { KeyInput } from "src/screens/Integrations/components/ConnectNewIntegration";

const routeUrl = "/organization";

export const organization = {
  getOrganization: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}`),
  getMe: () => axios.get(routeUrl + `/me`),
  getInvitationInfo: (orgSlug: string, invitationId: string) =>
    axios.get(routeUrl + `/invitation`, {
      params: {
        orgSlug,
        invitationId,
      },
    }),
  getFolders: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/folders`),
  getInsights: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/insights`, {
      params: {
        timezone: moment.tz.guess(),
      },
    }),
  getFolderStats: (organizationId: string, folderId: string) =>
    axios.get(routeUrl + `/${organizationId}/folder-stats`, {
      params: {
        folderId,
        timezone: moment.tz.guess(),
      },
    }),
  getOrganizationMembers: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/team`),
  updateUserPermissions: (
    organizationId: string,
    userIdToUpdate: string,
    newPermission?: orgPermissionLevel,
    isRemoved?: boolean
  ) =>
    axios.put(routeUrl + `/${organizationId}/user-permissions`, {
      userIdToUpdate,
      newPermission,
      isRemoved,
    }),
  getLogs: (
    organizationId: string,
    folderId?: string,
    isFavorites?: boolean,
    start?: number,
    logsNoNewerThanDate?: Date,
    logsNoOlderThanDate?: Date
  ) =>
    axios.get(routeUrl + `/${organizationId}/logs`, {
      params: {
        folderId,
        start,
        logsNoNewerThanDate,
        logsNoOlderThanDate,
        isFavorites,
      },
    }),
  acceptInvite: (
    organizationId: string,
    invitationId: string,
    email: string,
    password: string
  ) =>
    axios.post(routeUrl + `/${organizationId}/user`, {
      invitationId,
      email,
      password,
    }),
  generateInviteLink: (organizationId: string) =>
    axios.post(routeUrl + `/${organizationId}/invite-link`),
  generateSecretKey: (organizationId: string) =>
    axios.post(routeUrl + `/${organizationId}/secret-key`),
  searchForLogs: (
    organizationId: string,
    query: string,
    folderId?: string,
    isFavorites?: boolean
  ) =>
    axios.post(routeUrl + `/${organizationId}/search`, {
      folderId,
      query,
      isFavorites,
    }),
  getSupportLogs: (organizationId: string, query: string) =>
    axios.get(routeUrl + `/${organizationId}/support-logs`, {
      params: {
        query,
      },
    }),
  deleteFolderAndEverythingInside: (organizationId: string, folderId: string) =>
    axios.post(routeUrl + `/${organizationId}/delete-folder`, {
      folderId,
    }),
  favoriteFolderPath: (
    organizationId: string,
    fullPath: string,
    isRemoved?: boolean
  ) =>
    axios.post(routeUrl + `/${organizationId}/favorite-folder`, {
      fullPath,
      isRemoved,
    }),
  getFavoriteFolderPaths: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/favorite-folders`),
  setFolderPreference: (
    organizationId: string,
    fullPath: string,
    isMuted: boolean
  ) =>
    axios.post(routeUrl + `/${organizationId}/folder-preference`, {
      fullPath,
      isMuted,
    }),
  updateFolder: (
    organizationId: string,
    folderId: string,
    description?: string
  ) =>
    axios.put(routeUrl + `/${organizationId}/folder`, {
      folderId,
      description,
    }),
  getRules: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/rules`),
  createRule: (
    organizationId: string,
    folderId: string,
    comparisonType: comparisonTypeEnum,
    comparisonValue: number,
    lookbackTimeInMins: number,
    notificationType: notificationTypeEnum
  ) =>
    axios.post(routeUrl + `/${organizationId}/rule`, {
      folderId,
      comparisonType,
      comparisonValue,
      lookbackTimeInMins,
      notificationType,
    }),
  deleteRule: (organizationId: string, ruleId: string) =>
    axios.post(routeUrl + `/${organizationId}/delete-rule`, {
      ruleId,
    }),
  sendPhoneVerificationCode: (organizationId: string, phoneNumber: string) =>
    axios.post(routeUrl + `/${organizationId}/user/phone/send-code`, {
      phoneNumber,
    }),
  verifyPhoneCode: (
    organizationId: string,
    phoneNumber: string,
    code: string
  ) =>
    axios.post(routeUrl + `/${organizationId}/user/phone/verify-code`, {
      phoneNumber,
      code,
    }),
  addToWaitlist: (email: string, websiteUrl: string, description: string) =>
    axios.post(routeUrl + "/waitlist", {
      email,
      websiteUrl,
      description,
    }),
  deleteLog: (organizationId: string, logId: string) =>
    axios.post(routeUrl + `/${organizationId}/delete-log`, {
      logId,
    }),
  getIntegrations: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/integrations`),
  getConnectableIntegrations: (organizationId: string) =>
    axios.get(routeUrl + `/${organizationId}/connectable-integrations`),
  addIntegration: (
    organizationId: string,
    keys: KeyInput[],
    type: integrationTypeEnum,
    additionalProperties?: Object
  ) =>
    axios.post(routeUrl + `/${organizationId}/integration`, {
      keys,
      type,
      additionalProperties,
    }),
  deleteIntegration: (organizationId: string, integrationId: string) =>
    axios.post(routeUrl + `/${organizationId}/delete-integration`, {
      integrationId,
    }),
  updateIntegration: (
    organizationId: string,
    integrationId: string,
    fieldsToUpdate: Partial<IntegrationDocument>
  ) =>
    axios.put(routeUrl + `/${organizationId}/integration`, {
      integrationId,
      ...fieldsToUpdate,
    }),
};
