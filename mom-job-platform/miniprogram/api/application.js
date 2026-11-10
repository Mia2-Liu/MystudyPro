import request from '../utils/request'

export function applyJob(jobId, message) {
  return request({
    url: '/applications',
    method: 'POST',
    data: { job_id: jobId, message }
  })
}

export function getMyApplications(params) {
  return request({
    url: '/applications/my',
    method: 'GET',
    data: params
  })
}

export function getJobApplications(params) {
  return request({
    url: '/applications/job',
    method: 'GET',
    data: params
  })
}

export function handleApplication(id, status) {
  return request({
    url: `/applications/${id}`,
    method: 'PATCH',
    data: { status }
  })
}
