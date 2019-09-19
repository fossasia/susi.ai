import urls from './urls';

const getImageSrc = ({ relativePath }) =>
  `${urls.API_URL}/cms/getImage.png?${relativePath}`;

export default getImageSrc;
