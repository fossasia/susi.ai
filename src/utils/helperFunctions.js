import md5 from 'md5';
import urls from './urls';

export const isProduction = () => {
  let domain = window.location.hostname;
  return domain.indexOf('.susi.ai') > 0;
};

export const getAvatarProps = emailId => {
  const emailHash = md5(emailId);
  const GRAVATAR_IMAGE_URL = `${urls.GRAVATAR_URL}/${emailHash}.jpg`;
  const avatarProps = {
    name: emailId.toUpperCase(),
    src: GRAVATAR_IMAGE_URL,
  };
  return avatarProps;
};

export const sortCountryLexographical = countryData => {
  countryData.countries.all.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};
