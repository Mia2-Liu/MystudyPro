<template>
  <view class="role-select-container">
    <view class="header">
      <text class="title">请选择您的身份</text>
      <text class="subtitle">选择后不可更改，请谨慎选择</text>
    </view>

    <view class="role-list">
      <view class="role-card" :class="{ active: selectedRole === 'mom' }" @click="selectRole('mom')">
        <view class="role-icon mom-icon">
          <text class="icon-text">👩</text>
        </view>
        <view class="role-info">
          <text class="role-title">我是全职妈妈</text>
          <text class="role-desc">找一份早8晚4的工作，兼顾家庭与事业</text>
        </view>
        <view class="check-icon" v-if="selectedRole === 'mom'">✓</view>
      </view>

      <view class="role-card" :class="{ active: selectedRole === 'company' }" @click="selectRole('company')">
        <view class="role-icon company-icon">
          <text class="icon-text">🏢</text>
        </view>
        <view class="role-info">
          <text class="role-title">我是用人企业</text>
          <text class="role-desc">发布工作需求，招聘优秀的宝妈人才</text>
        </view>
        <view class="check-icon" v-if="selectedRole === 'company'">✓</view>
      </view>
    </view>

    <view class="footer">
      <button class="confirm-btn" :disabled="!selectedRole || loading" @click="confirmRole">
        {{ loading ? '提交中...' : '确认选择' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const selectedRole = ref('')
const loading = ref(false)

function selectRole(role) {
  selectedRole.value = role
}

async function confirmRole() {
  if (!selectedRole.value || loading.value) return
  
  loading.value = true
  try {
    const res = await userStore.setRole(selectedRole.value)
    
    if (selectedRole.value === 'mom') {
      uni.switchTab({ url: '/pages/mom/index/index' })
    } else {
      uni.redirectTo({ url: '/pages/company/index/index' })
    }
  } catch (err) {
    console.error('设置角色失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.role-select-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 80rpx;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.role-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  border: 3rpx solid transparent;
  transition: all 0.3s;
  position: relative;
  
  &.active {
    border-color: #FF6B9D;
    background: #FFF5F8;
  }
}

.role-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  flex-shrink: 0;
}

.mom-icon {
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
}

.company-icon {
  background: linear-gradient(135deg, #4A90E2, #67B8F7);
}

.icon-text {
  font-size: 48rpx;
}

.role-info {
  flex: 1;
}

.role-title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.role-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.check-icon {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  background: #FF6B9D;
  border-radius: 50%;
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  position: fixed;
  bottom: 60rpx;
  left: 40rpx;
  right: 40rpx;
}

.confirm-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(90deg, #FF6B9D, #FF8FAB);
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 48rpx;
  border: none;
  
  &[disabled] {
    opacity: 0.5;
  }
  
  &::after {
    border: none;
  }
}
</style>
