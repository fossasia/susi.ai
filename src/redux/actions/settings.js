import { createAction } from 'redux-actions';
import {
  SETTINGS_GET_USER_SETTINGS,
  SETTINGS_REMOVE_USER_DEVICE,
  SETTINGS_ADD_USER_DEVICE,
} from '../actionTypes';
import * as apis from '../../apis';

// const returnArgumentsFn = function(payload) {
//   return Promise.resolve(payload);
// };

export default {
  getUserSettings: createAction(
    SETTINGS_GET_USER_SETTINGS,
    apis.getUserSettings,
  ),
  removeUserDevice: createAction(
    SETTINGS_REMOVE_USER_DEVICE,
    apis.removeUserDevice,
  ),
  addUserDevice: createAction(SETTINGS_ADD_USER_DEVICE, apis.addUserDevice),
};
