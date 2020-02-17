import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';

export default {
  setUserAnalytics: createAction(actionTypes.SETTINGS_SET_USER_ANALYTICS),
  setUserRatings: createAction(actionTypes.SETTINGS_SET_USER_RATINGS),
};
