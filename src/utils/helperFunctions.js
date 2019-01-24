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

export const urlParam = param => {
  let results = new RegExp('[?&]' + param + '=([^&#]*)').exec(
    window.location.href,
  );
  if (results && results.length > 0) {
    let ans = decodeURIComponent((results[1] + '').replace(/\+/g, '%20'));
    return ans;
  }
  return 0;
};
