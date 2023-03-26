import axios from "../utils/axios";

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
  getLogs: (
    organizationId: string,
    folderId: string,
    start?: number,
    logsNoNewerThanDate?: Date
  ) =>
    axios.get(routeUrl + `/${organizationId}/logs`, {
      params: {
        folderId,
        start,
        logsNoNewerThanDate,
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
};
