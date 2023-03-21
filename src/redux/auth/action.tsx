import { AuthStatusType } from './reducer';

const SET_AUTH_STATUS = 'SET_AUTH_STATUS';
type SET_AUTH_STATUS = typeof SET_AUTH_STATUS;

type ISetAuthStatus = {
    type: SET_AUTH_STATUS;
    authStatus: AuthStatusType;
};

export const setAuthStatus = (authStatus: AuthStatusType): ISetAuthStatus => ({
    type: SET_AUTH_STATUS,
    authStatus
});

export type AuthActionsIndex = ISetAuthStatus;
