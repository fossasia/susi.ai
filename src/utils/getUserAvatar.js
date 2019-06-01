import { urls } from './';

let getUserAvatar = accessToken => {
  return `${
    urls.API_URL
  }/getAvatar.png?access_token=${accessToken}&q=${new Date().getTime()}`;
};

export default getUserAvatar;
