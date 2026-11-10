<template>
  <view class="job-manage-page">
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
        全部
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'active' }" @click="switchTab('active')">
        招聘中
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'inactive' }" @click="switchTab('inactive')">
        已下架
      </view>
    </view>

    <view class="job-list">
      <view class="job-card" v-for="job in jobList" :key="job.id">
        <view class="job-header">
          <text class="job-title">{{ job.title }}</text>
          <text class="job-status" :class="job.status === 1 ? 'active' : 'inactive'">
            {{ job.status === 1 ? '招聘中' : '已下架' }}
          </text>
        </view>
        <view class="job-info">
          <text class="info-text">⏰ {{ job.work_start_time }} - {{ job.work_end_time }}</text>
          <text class="info-text">👥 {{ job.apply_count }}人申请</text>
        </view>
        <view class="job-actions">
          <button class="action-btn primary" size="mini" @click="goApplicants(job.id)">
            查看申请
          </button>
          <button class="action-btn" size="mini" @click="toggleStatus(job)">
            {{ job.status === 1 ? '下架' : '上架' }}
          </button>
        </view>
      </view>

      <view class="empty" v-if="!loading && jobList.length === 0">
        <text class="empty-text">暂无工作</text>
      </view>
    </view>

    <view class="fab-btn" @click="goPublish">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCompanyJobs, toggleJobStatus } from '../../../api/job'

const jobList = ref([])
const loading = ref(false)
const activeTab = ref('all')
const page = ref(1)
const hasMore = ref(true)

onMounted(() => {
  loadJobs()
})

function switchTab(tab) {
  activeTab.value = tab
  page.value = 1
  hasMore.value = true
  jobList.value = []
  loadJobs()
}

async function loadJobs() {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    let status
    if (activeTab.value === 'active') status = 1
    if (activeTab.value === 'inactive') status = 0
    
    const res = await getCompanyJobs({
      page: page.value,
      pageSize: 10,
      status
    })
    jobList.value = [...jobList.value, ...res.list]
    hasMore.value = res.list.length === 10
    page.value++
  } catch (err) {
    console.error('加载失败:', err)
  } finally {
    loading.value = false
  }
}

async function toggleStatus(job) {
  const newStatus = job.status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '上架' : '下架'
  
  uni.showModal({
    title: '提示',
    content: `确定要${actionText}该工作吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await toggleJobStatus(job.id, newStatus)
          job.status = newStatus
          uni.showToast({ title: `${actionText}成功`, icon: 'success' })
        } catch (err) {
          console.error('操作失败:', err)
        }
      }
    }
  })
}

function goApplicants(jobId) {
  uni.navigateTo({
    url: `/pages/company/applicants/applicants?job_id=${jobId}`
  })
}

function goPublish() {
  uni.navigateTo({
    url: '/pages/company/publish/publish'
  })
}

function onReachBottom() {
  loadJobs()
}

function onShow() {
  if (jobList.value.length > 0) {
    page.value = 1
    hasMore.value = true
    jobList.value = []
    loadJobs()
  }
}
</script>

<style lang="scss" scoped>
.job-manage-page {
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
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

.job-list {
  padding: 20rpx 30rpx;
}

.job-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.job-header {
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

.job-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  
  &.active {
    background: #F6FFED;
    color: #52C41A;
  }
  &.inactive {
    background: #f5f5f5;
    color: #999;
  }
}

.job-info {
  display: flex;
  gap: 30rpx;
  margin-bottom: 24rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666;
}

.job-actions {
  display: flex;
  gap: 20rpx;
  justify-content: flex-end;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.action-btn {
  font-size: 26rpx;
  padding: 0 24rpx;
  border-radius: 30rpx;
  
  &.primary {
    background: #FF6B9D;
    color: #fff;
    border: none;
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

.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 157, 0.4);
  z-index: 100;
}

.fab-icon {
  font-size: 48rpx;
  color: #fff;
  line-height: 1;
}
</style>
