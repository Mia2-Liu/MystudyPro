import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { wxLogin as apiWxLogin, setRole as apiSetRole, getUserInfo } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(uni.getStorageSync('userInfo') || null)

  const isLoggedIn = computed(() => !!token.value)
  const role = computed(() => userInfo.value?.role || null)

  function setToken(newToken) {
    token.value = newToken
    uni.setStorageSync('token', newToken)
  }

  function setUserInfo(info) {
    userInfo.value = info
    uni.setStorageSync('userInfo', info)
  }

  async function login(code, nickname, avatar) {
    const res = await apiWxLogin(code, nickname, avatar)
    setToken(res.token)
    setUserInfo(res.user)
    return res
  }

  async function setRole(role) {
    const res = await apiSetRole(role)
    setToken(res.token)
    setUserInfo(res.user)
    return res
  }

  async function fetchUserInfo() {
    const res = await getUserInfo()
    setUserInfo(res)
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    role,
    setToken,
    setUserInfo,
    login,
    setRole,
    fetchUserInfo,
    logout
  }
})
