import request from './request'

export function wxLogin(code, nickname, avatar) {
  return request({
    url: '/auth/wx-login',
    method: 'POST',
    data: { code, nickname, avatar }
  })
}

export function setRole(role) {
  return request({
    url: '/auth/set-role',
    method: 'POST',
    data: { role }
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/user-info',
    method: 'GET'
  })
}
