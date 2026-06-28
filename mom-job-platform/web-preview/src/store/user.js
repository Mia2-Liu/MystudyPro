import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { wxLogin, setRole } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const role = computed(() => userInfo.value?.role || null)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  async function login(code, nickname, avatar) {
    const res = await wxLogin(code, nickname, avatar)
    setToken(res.token)
    setUserInfo(res.user)
    return res
  }

  async function setRoleAction(roleVal) {
    const res = await setRole(roleVal)
    setToken(res.token)
    setUserInfo(res.user)
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    role,
    setToken,
    setUserInfo,
    login,
    setRoleAction,
    logout
  }
})
