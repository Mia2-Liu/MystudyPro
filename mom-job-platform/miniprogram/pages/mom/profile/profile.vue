<template>
  <view class="profile-page">
    <view class="profile-header">
      <view class="user-info">
        <image class="avatar" :src="userStore.userInfo?.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
        <view class="user-detail">
          <text class="nickname">{{ userStore.userInfo?.nickname || '微信用户' }}</text>
          <text class="role-tag">全职妈妈</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goResume">
        <text class="menu-icon">📝</text>
        <text class="menu-title">我的简历</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goApplications">
        <text class="menu-icon">📋</text>
        <text class="menu-title">我的申请</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item">
        <text class="menu-icon">🔔</text>
        <text class="menu-title">消息通知</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">⚙️</text>
        <text class="menu-title">设置</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleLogout">
        <text class="menu-icon">🚪</text>
        <text class="menu-title logout">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '../../../store/user'

const userStore = useUserStore()

function goResume() {
  uni.navigateTo({
    url: '/pages/mom/resume/resume'
  })
}

function goApplications() {
  uni.switchTab({
    url: '/pages/mom/applications/applications'
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f8f8;
}

.profile-header {
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
  padding: 80rpx 30rpx 60rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  margin-right: 30rpx;
  background: #fff;
}

.user-detail {
  flex: 1;
}

.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12rpx;
}

.role-tag {
  display: inline-block;
  padding: 6rpx 20rpx;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 24rpx;
  border-radius: 20rpx;
}

.menu-section {
  margin: 20rpx 0;
  background: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 24rpx;
}

.menu-title {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  
  &.logout {
    color: #FF4D4F;
    text-align: center;
  }
}

.menu-arrow {
  font-size: 36rpx;
  color: #ccc;
}
</style>
