import request from '@/utils/request';

export function getSearchUser(username) {
  return request({
    url: '/friend/search/user',
    params: {
      username
    }
  })
}