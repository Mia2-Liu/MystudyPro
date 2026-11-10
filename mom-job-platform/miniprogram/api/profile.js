import request from '../utils/request'

export function getMomProfile() {
  return request({
    url: '/profile/mom',
    method: 'GET'
  })
}

export function updateMomProfile(data) {
  return request({
    url: '/profile/mom',
    method: 'PUT',
    data
  })
}

export function getCompanyProfile() {
  return request({
    url: '/profile/company',
    method: 'GET'
  })
}

export function updateCompanyProfile(data) {
  return request({
    url: '/profile/company',
    method: 'PUT',
    data
  })
}
