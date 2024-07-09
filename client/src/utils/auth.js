const authKey = 'chat-token';
const userInfo = 'userInfo';

export function setToken(token) {
  sessionStorage.setItem(authKey, token);
}

export function getToken() {
  return sessionStorage.getItem(authKey);
}

export function setUserInfo(info) {
  sessionStorage.setItem(userInfo, JSON.stringify(info));
}

export function getUserInfo() {
  return JSON.parse(sessionStorage.getItem(userInfo));
}