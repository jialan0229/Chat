import request from '@/utils/request';

export function _getList (params) {
  return request({
    url: '/message/friend/list',
    params
  })
}

export function _updateStatus (id) {
  return request({
    url: '/message/update/status',
    method: 'POST',
    data: {
      id
    }
  })
}