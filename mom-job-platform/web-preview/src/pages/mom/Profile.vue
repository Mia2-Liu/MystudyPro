<template>
  <div class="profile-page">
    <div class="content-wrap">
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar">
            <span>👩</span>
          </div>
          <div class="user-detail">
            <span class="nickname">{{ userStore.userInfo?.nickname || '微信用户' }}</span>
            <span class="role-tag">全职妈妈</span>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goResume">
          <span class="menu-icon">📝</span>
          <span class="menu-title">我的简历</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item" @click="goApplications">
          <span class="menu-icon">📋</span>
          <span class="menu-title">我的申请</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item">
          <span class="menu-icon">🔔</span>
          <span class="menu-title">消息通知</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">⚙️</span>
          <span class="menu-title">设置</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="handleLogout">
          <span class="menu-icon">🚪</span>
          <span class="menu-title logout">退出登录</span>
        </div>
      </div>
    </div>

    <TabBar current="profile" @change="onTabChange" />
  </div>
</template>

<script setup>
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'
import TabBar from '../../components/TabBar.vue'

const userStore = useUserStore()
const router = useRouter()

function goResume() {
  router.push('/mom/resume')
}

function goApplications() {
  router.push('/mom/applications')
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}

function onTabChange(tab) {
  if (tab === 'profile') return
  if (tab === 'jobs') {
    router.push('/mom/jobs')
  } else if (tab === 'applications') {
    router.push('/mom/applications')
  }
}
</script>

<style scoped lang="scss">
.profile-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  position: relative;
}

.content-wrap {
  flex: 1;
  overflow-y: auto;
}

.profile-header {
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
  padding: 40px 15px 30px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 30px;
}

.user-detail {
  flex: 1;
}

.nickname {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.role-tag {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
}

.menu-section {
  margin: 10px 0;
  background: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
}

.menu-title {
  flex: 1;
  font-size: 15px;
  color: #333;
  
  &.logout {
    color: #FF4D4F;
    text-align: center;
  }
}

.menu-arrow {
  font-size: 18px;
  color: #ccc;
}
</style>
