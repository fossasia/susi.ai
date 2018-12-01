import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

// const returnArgumentsFn = function(payload) {
//   return Promise.resolve(payload);
// };

export default {
  getUserSettings: createAction(
    actionTypes.SETTINGS_GET_USER_SETTINGS,
    apis.getUserSettings,
  ),
  removeUserDevice: createAction(
    actionTypes.SETTINGS_REMOVE_USER_DEVICE,
    apis.removeUserDevice,
  ),
  addUserDevice: createAction(
    actionTypes.SETTINGS_ADD_USER_DEVICE,
    apis.addUserDevice,
  ),
};
