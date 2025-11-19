// client/src/services/auth.js
import api from './api';

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

export function loadToken() {
  const t = localStorage.getItem('token');
  if (t) api.defaults.headers.common['Authorization'] = 'Bearer ' + t;
  return t;
}
