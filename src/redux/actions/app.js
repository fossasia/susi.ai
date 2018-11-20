import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

export default {
  getApiKeys: createAction(actionTypes.APP_GET_API_KEYS, returnArgumentsFn),
  getLogin: createAction(actionTypes.APP_GET_LOGIN, apis.getLogin),
};
