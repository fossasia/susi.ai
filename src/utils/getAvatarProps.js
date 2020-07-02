import md5 from 'md5';
import { urls } from './';
import store from '../store';

export const getUserAvatarLink = (payload) => {
  const { getThumbnail = false, userEmailId } = payload || {};
  const { accessToken } = store.getState().app;
  let link = `${
    urls.API_URL
  }/getAvatar.png?access_token=${accessToken}&q=${new Date().getTime()}`;
  link += `&getThumbnail=${getThumbnail}`;
  link = userEmailId ? (link += `&email=${userEmailId}`) : link;
  return link;
};

export const getGravatarProps = (emailId) => {
  const emailHash = md5(emailId);
  const GRAVATAR_IMAGE_URL = `${urls.GRAVATAR_URL}/${emailHash}.jpg`;
  const avatarProps = {
    name: emailId.toUpperCase(),
    src: GRAVATAR_IMAGE_URL,
  };
  return avatarProps;
};
