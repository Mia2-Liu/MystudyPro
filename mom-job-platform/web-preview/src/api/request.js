import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.method === 'get' && config.params) {
    Object.keys(config.params).forEach(key => {
      if (config.params[key] === undefined || config.params[key] === null || config.params[key] === '') {
        delete config.params[key]
      }
    })
  }
  return config
})

request.interceptors.response.use(
  response => {
    if (response.data.code === 0) {
      return response.data.data
    } else {
      console.error('业务错误:', response.data.message)
      return Promise.reject(response.data)
    }
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login'
      }
    }
    console.error('请求错误:', error.message)
    return Promise.reject(error)
  }
)

export default request
