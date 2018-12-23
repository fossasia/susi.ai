import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const defaultState = {
  userName: '',
  email: '',
  accessToken: '',
  uuid: '',
  isAdmin: false,
  apiKeys: {},
};

const { emailId, uuid, loggedIn, username, isAdmin } = cookies.getAll();
const cookiesAppValues = {
  email: emailId,
  uuid,
  accessToken: loggedIn,
  userName: username,
  isAdmin,
};

export default handleActions(
  {
    [actionTypes.APP_GET_API_KEYS](state, { payload }) {
      const { keys } = payload;
      return {
        ...state,
        apiKeys: { ...keys },
      };
    },
    [actionTypes.APP_GET_LOGIN](state, { payload }) {
      const { uuid, accessToken, requestPayload } = payload;
      const email = requestPayload.login;
      return {
        ...state,
        uuid,
        accessToken,
        email: accessToken ? email : '',
      };
    },
    [actionTypes.APP_LOGOUT](state, { payload }) {
      return {
        ...defaultState,
      };
    },
  },
  {
    ...defaultState,
    ...cookiesAppValues,
  },
);
