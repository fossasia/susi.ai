import urls from './urls';

export const isProduction = () => {
  let domain = window.location.hostname;
  return domain.indexOf('.susi.ai') > 0;
};

export const getAvatarProps = (emailId, accessToken) => {
  const imageUrl = `${urls.API_URL}/getAvatar.png?access_token=${accessToken}`;
  const avatarProps = {
    name: emailId.toUpperCase(),
    src: imageUrl,
  };
  return avatarProps;
};
