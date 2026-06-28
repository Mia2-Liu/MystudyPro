<template>
  <view class="applications-page">
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

    <view class="application-list">
      <view class="app-card" v-for="app in applicationList" :key="app.id">
        <view class="app-header">
          <text class="job-title">{{ app.job?.title }}</text>
          <text class="app-status" :class="app.status">{{ getStatusText(app.status) }}</text>
        </view>
        <view class="app-info">
          <text class="info-text">⏰ {{ app.job?.work_start_time }} - {{ app.job?.work_end_time }}</text>
          <text class="info-text">💼 {{ app.job?.work_type || '全职' }}</text>
        </view>
        <view class="app-footer">
          <text class="company">{{ app.job?.companyProfile?.company_name || '企业直招' }}</text>
          <text class="apply-time">{{ formatTime(app.created_at) }}</text>
        </view>
      </view>

      <view class="empty" v-if="!loading && applicationList.length === 0">
        <text class="empty-text">暂无申请记录</text>
      </view>
      <view class="loading-text" v-if="loading">加载中...</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyApplications } from '../../../api/application'

const applicationList = ref([])
const loading = ref(false)
const activeTab = ref('all')
const page = ref(1)
const hasMore = ref(true)

onMounted(() => {
  loadApplications()
})

function switchTab(tab) {
  activeTab.value = tab
  page.value = 1
  hasMore.value = true
  applicationList.value = []
  loadApplications()
}

async function loadApplications() {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: 10
    }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res = await getMyApplications(params)
    applicationList.value = [...applicationList.value, ...res.list]
    hasMore.value = res.list.length === 10
    page.value++
  } catch (err) {
    console.error('加载申请列表失败:', err)
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

function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

function onReachBottom() {
  loadApplications()
}

function onShow() {
  if (applicationList.value.length > 0) {
    page.value = 1
    hasMore.value = true
    applicationList.value = []
    loadApplications()
  }
}
</script>

<style lang="scss" scoped>
.applications-page {
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

.application-list {
  padding: 20rpx 30rpx;
}

.app-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
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

.app-info {
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.company {
  font-size: 26rpx;
  color: #333;
}

.apply-time {
  font-size: 24rpx;
  color: #999;
}

.empty {
  padding: 100rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.loading-text {
  text-align: center;
  padding: 40rpx;
  font-size: 26rpx;
  color: #999;
}
</style>
