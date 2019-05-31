import { urls } from '../utils';

const testExample = (e, exampleText) => {
  let link = `${urls.CHAT_URL}/?testExample=${exampleText}`;
  window.open(link, '_blank');
};

export default testExample;
