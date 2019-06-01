import md5 from 'md5';
import { urls } from './';

let getGravatarProps = emailId => {
  const emailHash = md5(emailId);
  const GRAVATAR_IMAGE_URL = `${urls.GRAVATAR_URL}/${emailHash}.jpg`;
  const avatarProps = {
    name: emailId.toUpperCase(),
    src: GRAVATAR_IMAGE_URL,
  };
  return avatarProps;
};

export default getGravatarProps;
