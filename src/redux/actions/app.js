import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

// const returnArgumentsFn = function(payload) {
//   return Promise.resolve(payload);
// };

export default {
  getApiKeys: createAction(actionTypes.APP_GET_API_KEYS, apis.fetchApiKeys),
  getLogin: createAction(actionTypes.APP_GET_LOGIN, apis.getLogin),
  getChangePassword: createAction(
    actionTypes.APP_GET_CHANGE_PASSWORD,
    apis.getChangePassword,
  ),
  getSignup: createAction(actionTypes.APP_GET_SIGNUP, apis.getSignup),
  getForgotPassword: createAction(
    actionTypes.APP_GET_FORGOT_PASSWORD,
    apis.getForgotPassword,
  ),
  getAdmin: createAction(actionTypes.APP_GET_ADMIN, apis.getAdmin),
};
