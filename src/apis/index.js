/* eslint camelcase: 0 */
import ajax from '../helpers/ajax';
import urls from '../utils/urls';
// import { Cookies } from 'react-cookie';
// import actions from '../redux/actions/messages';
const { API_URL } = urls;
const AUTH_API_PREFIX = 'aaa';
const CHAT_API_PREFIX = 'susi';
const CMS_API_PREFIX = 'cms';

export function fetchApiKeys(payload) {
  const url = `${API_URL}/${AUTH_API_PREFIX}/getApiKeys.json`;
  return ajax.get(url);
}

export function getLogin(payload) {
  const { email, password } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/login.json`;
  return ajax.get(url, { login: email, password, type: 'access-token' });
}

export function getSignup(payload) {
  const { email, password } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/signup.json`;
  return ajax.get(url, { signup: email, password });
}

export function getChangePassword(payload) {
  const { email, password, newPassword } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/changepassword.json`;
  return ajax.get(url, {
    changepassword: email,
    password,
    newpassword: newPassword,
  });
}

export function getUserSettings() {
  const url = `${API_URL}/${AUTH_API_PREFIX}/listUserSettings.json`;
  return ajax.get(url, {});
}

export function setUserSettings(payload) {
  const url = `${API_URL}/${AUTH_API_PREFIX}/changeUserSettings.json`;
  return ajax.get(url, payload);
}

export function removeUserDevice(payload) {
  const { macId } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/removeUserDevices.json`;
  return ajax.get(url, { macid: macId });
}

export function addUserDevice(payload) {
  const { macId, name, room, latitude, longitude } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/addNewDevice.json`;
  return ajax.get(url, { macid: macId, name, room, latitude, longitude });
}

export function getForgotPassword(payload) {
  const { email } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/recoverpassword.json`;
  return ajax.get(url, { forgotemail: email });
}

export function getSusiReply(payload) {
  const { message } = payload;

  const url = `${API_URL}/${CHAT_API_PREFIX}/chat.json`;
  const locale = document.documentElement.getAttribute('lang');

  // add location information if available
  // TODO

  // check for connectivity only then call this
  // TODO

  return ajax.get(url, {
    q: encodeURIComponent(message.text),
    language: locale,
    //eslint-disable-next-line
    device_type: 'Web Client',
  });
}

export function getSusiPreviewReply(message) {
  const url = `${API_URL}/${CHAT_API_PREFIX}/chat.json`;
  return ajax.get(url, { q: message });
}

export function getBlogReponse(blogKey) {
  const url = 'https://api.rss2json.com/v1/api.json';
  return ajax.get(url, {
    count: '50',
    //eslint-disable-next-line
    api_key: blogKey,
    //eslint-disable-next-line
    rss_url: 'http://blog.fossasia.org/tag/susi-ai/feed/',
  });
}

export function getHistory() {
  const url = `${API_URL}/${CHAT_API_PREFIX}/memory.json`;
  return ajax.get(url, {});
}

export function getWebSearchResults(query) {
  return ajax.get('https://api.duckduckgo.com', { format: 'json', q: query });
}

export function previewURLForImage() {
  return ajax.get();
}

export function postSkillFeedback(payload) {
  const {
    model,
    group,
    language,
    skill,
    feedback,
    reply,
    query,
    countryName,
    countryCode,
  } = payload;
  const url = `${API_URL}/${CMS_API_PREFIX}/feedbackLog.json`;
  return ajax.get(url, {
    model,
    group,
    language,
    skill,
    rating: feedback,
    susi_reply: reply,
    user_query: query,
    country_name: countryName,
    country_code: countryCode,
    device_type: 'Web Client',
  });
}
