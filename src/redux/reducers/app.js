import { handleActions } from 'redux-actions';
import { APP_GET_API_KEYS, APP_GET_LOGIN } from '../actionTypes';

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
    [APP_GET_API_KEYS](state, { payload }) {
      return {
        ...state,
      };
    },
    [APP_GET_LOGIN](state, { payload }) {
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
