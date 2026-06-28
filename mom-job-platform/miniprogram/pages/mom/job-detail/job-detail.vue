<template>
  <view class="job-detail" v-if="job">
    <scroll-view scroll-y class="scroll-container">
      <view class="job-header">
        <text class="job-title">{{ job.title }}</text>
        <text class="job-salary">{{ formatSalary(job) }}</text>
      </view>

      <view class="job-info">
        <view class="info-item">
          <text class="label">⏰ 工作时间</text>
          <text class="value">{{ job.work_start_time }} - {{ job.work_end_time }}</text>
        </view>
        <view class="info-item" v-if="job.work_days && job.work_days.length">
          <text class="label">📅 工作日</text>
          <text class="value">{{ formatWorkDays(job.work_days) }}</text>
        </view>
        <view class="info-item">
          <text class="label">📍 工作地点</text>
          <text class="value">{{ job.address || '待定' }}</text>
        </view>
        <view class="info-item" v-if="job.work_type">
          <text class="label">💼 工作类型</text>
          <text class="value">{{ job.work_type }}</text>
        </view>
        <view class="info-item">
          <text class="label">👥 招聘人数</text>
          <text class="value">{{ job.people_count }}人</text>
        </view>
      </view>

      <view class="section" v-if="job.content">
        <text class="section-title">工作内容</text>
        <text class="section-content">{{ job.content }}</text>
      </view>

      <view class="section" v-if="job.requirements">
        <text class="section-title">任职要求</text>
        <text class="section-content">{{ job.requirements }}</text>
      </view>

      <view class="section" v-if="job.benefits && job.benefits.length">
        <text class="section-title">福利待遇</text>
        <view class="benefits-list">
          <text class="benefit-tag" v-for="(item, index) in job.benefits" :key="index">{{ item }}</text>
        </view>
      </view>

      <view class="section company-section" v-if="job.companyProfile">
        <text class="section-title">企业信息</text>
        <view class="company-info">
          <text class="company-name">{{ job.companyProfile.company_name }}</text>
          <text class="company-desc" v-if="job.companyProfile.industry">{{ job.companyProfile.industry }} · {{ job.companyProfile.scale }}</text>
          <text class="company-intro" v-if="job.companyProfile.intro">{{ job.companyProfile.intro }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="footer-bar">
      <view class="footer-left">
      </view>
      <button class="apply-btn" :disabled="applying" @click="handleApply">
        {{ applying ? '申请中...' : '立即申请' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobDetail } from '../../../api/job'
import { applyJob } from '../../../api/application'
import { useUserStore } from '../../../store/user'

const userStore = useUserStore()
const job = ref(null)
const applying = ref(false)
const jobId = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  jobId.value = currentPage.options.id
  loadDetail()
})

async function loadDetail() {
  try {
    const res = await getJobDetail(jobId.value)
    job.value = res
  } catch (err) {
    console.error('获取详情失败:', err)
  }
}

function formatSalary(job) {
  if (!job.salary_min && !job.salary_max) return '面议'
  const unit = { hourly: '元/时', daily: '元/天', monthly: '元/月', project: '元/项目' }[job.salary_type] || '元'
  if (job.salary_min && job.salary_max) {
    return `${job.salary_min}-${job.salary_max}${unit}`
  }
  return `${job.salary_min || job.salary_max}${unit}`
}

function formatWorkDays(days) {
  const dayMap = { 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 0: '周日' }
  return days.map(d => dayMap[d] || d).join('、')
}

async function handleApply() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  if (applying.value) return
  applying.value = true

  try {
    await applyJob(jobId.value, '')
    uni.showToast({
      title: '申请成功',
      icon: 'success'
    })
  } catch (err) {
    console.error('申请失败:', err)
  } finally {
    applying.value = false
  }
}
</script>

<style lang="scss" scoped>
.job-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.scroll-container {
  flex: 1;
  padding-bottom: 140rpx;
}

.job-header {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
}

.job-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.job-salary {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF6B9D;
}

.job-info {
  background: #fff;
  padding: 10rpx 30rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  max-width: 60%;
}

.section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.benefits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.benefit-tag {
  padding: 10rpx 20rpx;
  background: #FFF5F8;
  color: #FF6B9D;
  font-size: 24rpx;
  border-radius: 8rpx;
}

.company-section {
  margin-bottom: 40rpx;
}

.company-info {
  padding: 10rpx 0;
}

.company-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.company-desc {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.company-intro {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.footer-left {
  flex: 1;
}

.apply-btn {
  width: 300rpx;
  height: 80rpx;
  background: linear-gradient(90deg, #FF6B9D, #FF8FAB);
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
  
  &[disabled] {
    opacity: 0.6;
  }
  
  &::after {
    border: none;
  }
}
</style>
