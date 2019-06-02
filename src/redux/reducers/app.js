import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';
import { getUserAvatarLink } from '../../utils/getAvatarProps';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const defaultState = {
  userName: '',
  email: '',
  accessToken: '',
  uuid: '',
  isAdmin: null,
  apiKeys: {},
  visited: true,
  userSkills: [],
  avatarImg: 'https://api.susi.ai/getAvatar.png',
};

const { emailId, uuid, loggedIn, username, visited } = cookies.getAll();
const cookiesAppValues = {
  email: emailId,
  uuid,
  accessToken: loggedIn,
  userName: username,
  location: {
    countryCode: '',
    countryName: '',
  },
  visited,
  avatarImg: `https://api.susi.ai/getAvatar.png?access_token=${loggedIn}&q=${new Date().getTime()}`,
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
    [actionTypes.APP_GET_ADMIN](state, { payload }) {
      const { showAdmin: isAdmin } = payload;
      return {
        ...state,
        isAdmin,
      };
    },
    [actionTypes.APP_SET_VISITED_STATE](state, { payload }) {
      return {
        ...state,
        visited: true,
      };
    },
    [actionTypes.APP_GET_USER_SKILLS](state, { payload }) {
      let skillsData = [];
      for (let i of payload.filteredData) {
        skillsData.push({
          skillName: i.skillName,
          type: 'public',
          status: 'active',
          ...i,
        });
      }
      const userSkills = skillsData.filter(item => {
        if (item.authorEmail === state.email) {
          return item;
        }
        return null;
      });
      return {
        ...state,
        userSkills,
      };
    },
    [actionTypes.APP_UPDATE_USER_AVATAR](state, { payload }) {
      return {
        ...state,
        avatarImg: getUserAvatarLink(),
      };
    },
  },
  {
    ...defaultState,
    ...cookiesAppValues,
  },
);
