const authKey = 'chat-token';

export function setToken(token) {
  sessionStorage.setItem(authKey, token);
}

export function getToken() {
  return sessionStorage.getItem(authKey);
}