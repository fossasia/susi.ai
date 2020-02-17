import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const config = {
  analytics: [],
  ratings: [],
};

const defaultState = {
  ...config,
  userSettingsViewedByAdmin: {
    ...config,
    email: '',
  },
};

export default handleActions(
  {
    [actionTypes.SETTINGS_SET_USER_ANALYTICS](state, { payload }) {
      return {
        ...state,
        analytics: payload,
      };
    },
    [actionTypes.SETTINGS_SET_USER_RATINGS](state, { payload }) {
      return {
        ...state,
        ratings: payload,
      };
    },
  },
  defaultState,
);
