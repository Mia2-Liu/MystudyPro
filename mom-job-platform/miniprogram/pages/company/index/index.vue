<template>
  <view class="company-index">
    <view class="header">
      <view class="user-info">
        <text class="company-name">{{ companyInfo.company_name || '完善企业信息' }}</text>
        <text class="company-desc">{{ companyInfo.industry || '点击设置企业资料' }}</text>
      </view>
    </view>

    <view class="stat-cards">
      <view class="stat-card">
        <text class="stat-num">{{ stats.total || 0 }}</text>
        <text class="stat-label">发布工作</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ stats.active || 0 }}</text>
        <text class="stat-label">招聘中</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ stats.applications || 0 }}</text>
        <text class="stat-label">新申请</text>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-card publish" @click="goPublish">
        <text class="action-icon">📢</text>
        <text class="action-title">发布工作</text>
        <text class="action-desc">快速发布招聘需求</text>
      </view>
      <view class="action-card manage" @click="goJobManage">
        <text class="action-icon">📋</text>
        <text class="action-title">工作管理</text>
        <text class="action-desc">管理已发布的工作</text>
      </view>
    </view>

    <view class="recent-section">
      <view class="section-header">
        <text class="section-title">最近发布</text>
        <text class="section-more" @click="goJobManage">查看全部 ›</text>
      </view>

      <view class="job-list">
        <view class="job-item" v-for="job in recentJobs" :key="job.id" @click="goApplicants(job.id)">
          <view class="job-info">
            <text class="job-title">{{ job.title }}</text>
            <text class="job-time">{{ job.work_start_time }} - {{ job.work_end_time }}</text>
          </view>
          <view class="job-right">
            <text class="apply-count">{{ job.apply_count }}人申请</text>
            <text class="job-status" :class="job.status === 1 ? 'active' : 'inactive'">
              {{ job.status === 1 ? '招聘中' : '已下架' }}
            </text>
          </view>
        </view>

        <view class="empty" v-if="recentJobs.length === 0">
          <text class="empty-text">暂无发布的工作</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanyJobs } from '../../../api/job'
import { getCompanyProfile } from '../../../api/profile'
import { useUserStore } from '../../../store/user'

const userStore = useUserStore()
const recentJobs = ref([])
const companyInfo = ref({})
const stats = reactive({
  total: 0,
  active: 0,
  applications: 0
})

onMounted(() => {
  loadData()
})

async function loadData() {
  try {
    const [profileRes, jobsRes] = await Promise.all([
      getCompanyProfile().catch(() => ({})),
      getCompanyJobs({ page: 1, pageSize: 5 }).catch(() => ({ list: [], total: 0 }))
    ])

    companyInfo.value = profileRes || {}
    recentJobs.value = jobsRes.list || []
    stats.total = jobsRes.total || 0
    stats.active = (jobsRes.list || []).filter(j => j.status === 1).length
    stats.applications = (jobsRes.list || []).reduce((sum, j) => sum + (j.apply_count || 0), 0)
  } catch (err) {
    console.error('加载数据失败:', err)
  }
}

function goPublish() {
  uni.navigateTo({
    url: '/pages/company/publish/publish'
  })
}

function goJobManage() {
  uni.navigateTo({
    url: '/pages/company/job-manage/job-manage'
  })
}

function goApplicants(jobId) {
  uni.navigateTo({
    url: `/pages/company/applicants/applicants?job_id=${jobId}`
  })
}

function onShow() {
  if (userStore.isLoggedIn) {
    loadData()
  }
}
</script>

<style lang="scss" scoped>
.company-index {
  min-height: 100vh;
  background: #f8f8f8;
}

.header {
  background: linear-gradient(135deg, #4A90E2, #67B8F7);
  padding: 80rpx 30rpx 60rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12rpx;
}

.company-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.stat-cards {
  display: flex;
  margin: -30rpx 30rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.stat-card {
  flex: 1;
  text-align: center;
  border-right: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-right: none;
  }
}

.stat-num {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.quick-actions {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
}

.action-card {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  text-align: center;
  
  &.publish {
    background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
    
    .action-title, .action-desc {
      color: #fff;
    }
  }
}

.action-icon {
  display: block;
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.action-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.action-desc {
  font-size: 24rpx;
  color: #999;
}

.recent-section {
  background: #fff;
  margin: 0 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #FF6B9D;
}

.job-list {
  margin-top: 10rpx;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.job-info {
  flex: 1;
}

.job-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.job-time {
  font-size: 24rpx;
  color: #999;
}

.job-right {
  text-align: right;
}

.apply-count {
  display: block;
  font-size: 24rpx;
  color: #FF6B9D;
  margin-bottom: 8rpx;
}

.job-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  
  &.active {
    background: #F6FFED;
    color: #52C41A;
  }
  &.inactive {
    background: #f5f5f5;
    color: #999;
  }
}

.empty {
  padding: 60rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}
</style>
