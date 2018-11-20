import ajax from '../helpers/ajax';
import urls from '../utils/urls';
const { API_URL } = urls;
const AUTH_API_PREFIX = 'aaa';

/* Export API calls from this file
Example function -
*/
export function fetchApiKeys(payload) {
  const url = `${API_URL}/${AUTH_API_PREFIX}/getApiKeys.json`;
  return ajax.get(url);
}

export function getLogin(payload) {
  const { email, password } = payload;
  const url = `${API_URL}/${AUTH_API_PREFIX}/login.json`;
  return ajax.get(url, { login: email, password, type: 'access-token' });
}
