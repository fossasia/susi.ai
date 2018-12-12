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

export function getAdmin() {
  const url = `${API_URL}/${AUTH_API_PREFIX}/showAdminService.json}`;
  return ajax.get(url, {});
}

export function getUserSettings() {
  const url = `${API_URL}/${AUTH_API_PREFIX}/listUserSettings.json`;
  return ajax.get(url, {});
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
