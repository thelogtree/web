import { createSelector } from 'reselect';
import { getAuthReducer } from '../selectorIndex';

export const getAuthStatus = createSelector(
    [getAuthReducer],
    authReducer => authReducer.authStatus
);
