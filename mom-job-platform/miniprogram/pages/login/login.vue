<template>
  <view class="login-container">
    <view class="logo-section">
      <view class="logo">
        <text class="logo-text">宝妈兼职</text>
      </view>
      <text class="slogan">灵活工作，兼顾家庭</text>
    </view>

    <view class="login-section">
      <button class="wx-login-btn" @click="handleWxLogin">
        <text class="btn-text">微信一键登录</text>
      </button>
      <text class="tip-text">登录即表示同意《用户协议》和《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const loading = ref(false)

function handleWxLogin() {
  if (loading.value) return
  loading.value = true

  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      try {
        const res = await userStore.login(loginRes.code, '', '')
        
        if (res.user.role) {
          redirectByRole(res.user.role)
        } else {
          uni.redirectTo({ url: '/pages/role-select/role-select' })
        }
      } catch (err) {
        console.error('登录失败:', err)
      } finally {
        loading.value = false
      }
    },
    fail: (err) => {
      console.error('微信登录失败:', err)
      loading.value = false
      uni.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  })
}

function redirectByRole(role) {
  if (role === 'mom') {
    uni.switchTab({ url: '/pages/mom/index/index' })
  } else if (role === 'company') {
    uni.switchTab({ url: '/pages/company/index/index' })
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FF6B9D 0%, #FF8FAB 50%, #FFE5EC 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 200rpx 60rpx 100rpx;
  box-sizing: border-box;
}

.logo-section {
  text-align: center;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  background: #fff;
  border-radius: 40rpx;
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 30rpx rgba(255, 107, 157, 0.3);
}

.logo-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF6B9D;
}

.slogan {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
}

.login-section {
  padding: 0 20rpx;
}

.wx-login-btn {
  width: 100%;
  height: 96rpx;
  background: #fff;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  
  &::after {
    border: none;
  }
}

.btn-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.tip-text {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
