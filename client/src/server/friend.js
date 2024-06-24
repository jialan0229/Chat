import request from '@/utils/request';

// 查询好友
export function getSearchUser(username) {
  return request({
    url: '/friend/search/user',
    params: {
      username
    }
  })
}

// 添加好友
export function _addFriend(data) {
  return request({
    url: '/friend/add/friend',
    method: 'post',
    data
  })
}