import md5 from 'md5';
import { urls } from './';
import store from '../store';

export const getUserAvatarLink = payload => {
  const { getThumbnail = false } = payload || {};
  const { accessToken } = store.getState().app;
  return `${
    urls.API_URL
  }/getAvatar.png?access_token=${accessToken}&q=${new Date().getTime()}
    &getThumbnail=${getThumbnail}`;
};

export const getGravatarProps = emailId => {
  const emailHash = md5(emailId);
  const GRAVATAR_IMAGE_URL = `${urls.GRAVATAR_URL}/${emailHash}.jpg`;
  const avatarProps = {
    name: emailId.toUpperCase(),
    src: GRAVATAR_IMAGE_URL,
  };
  return avatarProps;
};
