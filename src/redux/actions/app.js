import { createAction } from 'redux-actions';
import actionTypes from './actionTypes';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

export default {
  getApiKeys: createAction(actionTypes.APP_GET_API_KEYS, returnArgumentsFn),
};
