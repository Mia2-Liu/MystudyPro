<template>
  <view class="mom-index">
    <view class="search-bar">
      <view class="search-input" @click="showSearch = true">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索工作岗位</text>
      </view>
    </view>

    <view class="filter-bar">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-list">
          <view class="filter-item" :class="{ active: activeSort === 'latest' }" @click="changeSort('latest')">
            最新
          </view>
          <view class="filter-item" :class="{ active: activeSort === 'salary' }" @click="changeSort('salary')">
            薪资最高
          </view>
          <view class="filter-item" :class="{ active: activeSort === 'hot' }" @click="changeSort('hot')">
            热门
          </view>
          <view class="filter-item" v-for="type in workTypes" :key="type" :class="{ active: activeType === type }" @click="selectType(type)">
            {{ type }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="job-list">
      <view class="job-card" v-for="job in jobList" :key="job.id" @click="goDetail(job.id)">
        <view class="job-header">
          <text class="job-title">{{ job.title }}</text>
          <text class="job-salary">{{ formatSalary(job) }}</text>
        </view>
        <view class="job-tags">
          <text class="tag time-tag">⏰ {{ job.work_start_time }} - {{ job.work_end_time }}</text>
          <text class="tag" v-if="job.work_type">{{ job.work_type }}</text>
        </view>
        <view class="job-footer">
          <text class="company-name">{{ job.companyProfile?.company_name || '企业直招' }}</text>
          <text class="job-address">📍 {{ job.address }}</text>
        </view>
      </view>

      <view class="loading-text" v-if="loading">加载中...</view>
      <view class="no-more" v-if="!loading && jobList.length > 0 && !hasMore">没有更多了</view>
      <view class="empty" v-if="!loading && jobList.length === 0">
        <text class="empty-text">暂无相关工作</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobList } from '../../../api/job'

const jobList = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const activeSort = ref('latest')
const activeType = ref('')
const keyword = ref('')

const workTypes = ['文案编辑', '手工制作', '客服', '设计', '数据录入', '家政']

onMounted(() => {
  loadJobs()
})

async function loadJobs(refresh = false) {
  if (loading.value) return
  if (refresh) {
    page.value = 1
    hasMore.value = true
    jobList.value = []
  }
  if (!hasMore.value) return

  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize,
      sort: activeSort.value,
      work_type: activeType.value || undefined,
      keyword: keyword.value || undefined
    }
    const res = await getJobList(params)
    jobList.value = [...jobList.value, ...res.list]
    hasMore.value = page.value < res.totalPages
    page.value++
  } catch (err) {
    console.error('加载工作列表失败:', err)
  } finally {
    loading.value = false
  }
}

function changeSort(sort) {
  activeSort.value = sort
  loadJobs(true)
}

function selectType(type) {
  activeType.value = activeType.value === type ? '' : type
  loadJobs(true)
}

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/mom/job-detail/job-detail?id=${id}`
  })
}

function formatSalary(job) {
  if (!job.salary_min && !job.salary_max) return '面议'
  const unit = { hourly: '元/时', daily: '元/天', monthly: '元/月', project: '元/项目' }[job.salary_type] || '元'
  if (job.salary_min && job.salary_max) {
    return `${job.salary_min}-${job.salary_max}${unit}`
  }
  return `${job.salary_min || job.salary_max}${unit}`
}

function onReachBottom() {
  loadJobs()
}

function onPullDownRefresh() {
  loadJobs(true).then(() => {
    uni.stopPullDownRefresh()
  })
}
</script>

<style lang="scss" scoped>
.mom-index {
  min-height: 100vh;
  background: #f8f8f8;
}

.search-bar {
  padding: 20rpx 30rpx;
  background: #fff;
}

.search-input {
  height: 72rpx;
  background: #f5f5f5;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999;
}

.filter-bar {
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: inline-flex;
  padding: 20rpx 30rpx;
  gap: 20rpx;
}

.filter-item {
  padding: 12rpx 28rpx;
  background: #f5f5f5;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #666;
  
  &.active {
    background: #FFE5EC;
    color: #FF6B9D;
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
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.job-salary {
  font-size: 30rpx;
  font-weight: bold;
  color: #FF6B9D;
  white-space: nowrap;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.tag {
  padding: 8rpx 16rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.time-tag {
  background: #FFF5F8;
  color: #FF6B9D;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.company-name {
  font-size: 26rpx;
  color: #333;
}

.job-address {
  font-size: 24rpx;
  color: #999;
}

.loading-text, .no-more, .empty {
  text-align: center;
  padding: 40rpx;
  font-size: 26rpx;
  color: #999;
}

.empty-text {
  font-size: 28rpx;
}
</style>
