import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  name: '',
  email: '',
  id: '',
  isAdmin: false,
  apiKeys: {},
};

export default handleActions(
  {
    [actionTypes.APP_GET_API_KEYS](state, { payload }) {
      return {
        ...state,
        apiKeys: payload,
      };
    },
  },
  defaultState,
);
