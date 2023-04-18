import { comparisonTypeEnum, orgPermissionLevel } from "logtree-types";
import axios from "../utils/axios";
import moment from "moment";

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
    lookbackTimeInMins: number
  ) =>
    axios.post(routeUrl + `/${organizationId}/rule`, {
      folderId,
      comparisonType,
      comparisonValue,
      lookbackTimeInMins,
    }),
  deleteRule: (organizationId: string, ruleId: string) =>
    axios.post(routeUrl + `/${organizationId}/delete-rule`, {
      ruleId,
    }),
};
