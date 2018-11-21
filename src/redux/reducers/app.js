import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  name: '',
  email: '',
  accessToken: '',
  uuid: '',
  isAdmin: false,
  apiKeys: {},
};

export default handleActions(
  {
    [actionTypes.APP_GET_API_KEYS](state, { payload }) {
      return {
        ...state,
      };
    },
    [actionTypes.APP_GET_LOGIN](state, { payload }) {
      const { uuid, accessToken } = payload;
      return {
        ...state,
        uuid,
        accessToken,
      };
    },
  },
  defaultState,
);
