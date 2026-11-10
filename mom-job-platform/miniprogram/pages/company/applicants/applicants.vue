<template>
  <view class="applicants-page">
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
        全部
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'pending' }" @click="switchTab('pending')">
        待处理
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'accepted' }" @click="switchTab('accepted')">
        已通过
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'rejected' }" @click="switchTab('rejected')">
        已拒绝
      </view>
    </view>

    <view class="applicant-list">
      <view class="applicant-card" v-for="app in applicantList" :key="app.id">
        <view class="applicant-header">
          <view class="user-info">
            <view class="avatar">
              <text class="avatar-text">{{ app.momProfile?.name?.charAt(0) || '求' }}</text>
            </view>
            <view class="info-detail">
              <text class="name">{{ app.momProfile?.name || '匿名用户' }}</text>
              <text class="meta">{{ app.momProfile?.age || '--' }}岁 · {{ app.momProfile?.area || '不限区域' }}</text>
            </view>
          </view>
          <text class="app-status" :class="app.status">{{ getStatusText(app.status) }}</text>
        </view>

        <view class="applicant-skills" v-if="app.momProfile?.skills && app.momProfile.skills.length">
          <text class="skill-tag" v-for="(skill, index) in app.momProfile.skills.slice(0, 4)" :key="index">{{ skill }}</text>
        </view>

        <view class="applicant-message" v-if="app.message">
          <text class="message-label">申请留言：</text>
          <text class="message-text">{{ app.message }}</text>
        </view>

        <view class="applicant-actions" v-if="app.status === 'pending'">
          <button class="action-btn reject" size="mini" @click="handleAction(app, 'rejected')">
            拒绝
          </button>
          <button class="action-btn accept" size="mini" @click="handleAction(app, 'accepted')">
            通过
          </button>
        </view>
      </view>

      <view class="empty" v-if="!loading && applicantList.length === 0">
        <text class="empty-text">暂无申请者</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobApplications, handleApplication } from '../../../api/application'

const applicantList = ref([])
const loading = ref(false)
const activeTab = ref('all')
const page = ref(1)
const hasMore = ref(true)
const jobId = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  jobId.value = currentPage.options.job_id
  loadApplicants()
})

function switchTab(tab) {
  activeTab.value = tab
  page.value = 1
  hasMore.value = true
  applicantList.value = []
  loadApplicants()
}

async function loadApplicants() {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    const params = {
      job_id: jobId.value,
      page: page.value,
      pageSize: 10
    }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res = await getJobApplications(params)
    applicantList.value = [...applicantList.value, ...res.list]
    hasMore.value = res.list.length === 10
    page.value++
  } catch (err) {
    console.error('加载申请者失败:', err)
  } finally {
    loading.value = false
  }
}

function getStatusText(status) {
  const map = {
    pending: '待处理',
    accepted: '已通过',
    rejected: '已拒绝'
  }
  return map[status] || status
}

async function handleAction(app, status) {
  const actionText = status === 'accepted' ? '通过' : '拒绝'
  
  uni.showModal({
    title: '提示',
    content: `确定要${actionText}该申请吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await handleApplication(app.id, status)
          app.status = status
          uni.showToast({ title: `已${actionText}`, icon: 'success' })
        } catch (err) {
          console.error('操作失败:', err)
        }
      }
    }
  })
}

function onReachBottom() {
  loadApplicants()
}
</script>

<style lang="scss" scoped>
.applicants-page {
  min-height: 100vh;
  background: #f8f8f8;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 10rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 28rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
  
  &.active {
    color: #FF6B9D;
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 6rpx;
      background: #FF6B9D;
      border-radius: 3rpx;
    }
  }
}

.applicant-list {
  padding: 20rpx 30rpx;
}

.applicant-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.avatar-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

.info-detail {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.meta {
  font-size: 24rpx;
  color: #999;
}

.app-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  
  &.pending {
    background: #FFF7E6;
    color: #FA8C16;
  }
  &.accepted {
    background: #F6FFED;
    color: #52C41A;
  }
  &.rejected {
    background: #FFF1F0;
    color: #FF4D4F;
  }
}

.applicant-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.skill-tag {
  padding: 6rpx 16rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #666;
}

.applicant-message {
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.message-label {
  font-size: 24rpx;
  color: #999;
}

.message-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.applicant-actions {
  display: flex;
  gap: 20rpx;
  justify-content: flex-end;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.action-btn {
  font-size: 26rpx;
  padding: 0 28rpx;
  border-radius: 30rpx;
  border: none;
  
  &.accept {
    background: #52C41A;
    color: #fff;
  }
  
  &.reject {
    background: #f5f5f5;
    color: #666;
  }
  
  &::after {
    border: none;
  }
}

.empty {
  padding: 100rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
