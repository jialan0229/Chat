import request from '@/utils/request';

export function _getList (params) {
  return request({
    url: '/message/friend/list',
    method: 'get',
    params
  })
}