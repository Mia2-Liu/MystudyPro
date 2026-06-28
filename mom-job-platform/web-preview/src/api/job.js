import request from './request'

export function getJobList(params) {
  return request({
    url: '/jobs',
    method: 'GET',
    params
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

export function getCompanyJobs(params) {
  return request({
    url: '/jobs/company/list',
    method: 'GET',
    params
  })
}

export function toggleJobStatus(id, status) {
  return request({
    url: `/jobs/${id}/status`,
    method: 'PATCH',
    data: { status }
  })
}
