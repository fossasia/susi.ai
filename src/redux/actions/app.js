import { createAction } from 'redux-actions';
import {
  APP_GET_API_KEYS,
  APP_GET_LOGIN,
  APP_GET_CHANGE_PASSWORD,
  APP_GET_FORGOT_PASSWORD,
  APP_GET_SIGNUP,
} from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

export const getApiKeys = createAction(APP_GET_API_KEYS, returnArgumentsFn);

export const getLogin = createAction(APP_GET_LOGIN, apis.getLogin);

export const getChangePassword = createAction(
  APP_GET_CHANGE_PASSWORD,
  apis.getChangePassword,
);

export const getForgotPassword = createAction(
  APP_GET_FORGOT_PASSWORD,
  apis.getForgotPassword,
);

export const getSignup = createAction(APP_GET_SIGNUP, apis.getSignup);
