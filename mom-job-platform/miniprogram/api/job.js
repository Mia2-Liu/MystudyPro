import request from '../utils/request'

export function getJobList(params) {
  return request({
    url: '/jobs',
    method: 'GET',
    data: params
  })
}

export function getJobDetail(id) {
  return request({
    url: `/jobs/${id}`,
    method: 'GET'
  })
}

export function createJob(data) {
  return request({
    url: '/jobs',
    method: 'POST',
    data
  })
}

export function updateJob(id, data) {
  return request({
    url: `/jobs/${id}`,
    method: 'PUT',
    data
  })
}

export function getCompanyJobs(params) {
  return request({
    url: '/jobs/company/list',
    method: 'GET',
    data: params
  })
}

export function toggleJobStatus(id, status) {
  return request({
    url: `/jobs/${id}/status`,
    method: 'PATCH',
    data: { status }
  })
}
