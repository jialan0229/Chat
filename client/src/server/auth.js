
import request from '@/utils/request';

export function _login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}


export function _register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}