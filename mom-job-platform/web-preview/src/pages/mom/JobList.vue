<template>
  <div class="job-list-page">
    <div class="content-wrap">
      <div class="search-bar">
        <div class="search-input">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">搜索工作岗位</span>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-scroll">
          <div class="filter-item" :class="{ active: activeSort === 'latest' }" @click="changeSort('latest')">
            最新
          </div>
          <div class="filter-item" :class="{ active: activeSort === 'salary' }" @click="changeSort('salary')">
            薪资最高
          </div>
          <div class="filter-item" :class="{ active: activeSort === 'hot' }" @click="changeSort('hot')">
            热门
          </div>
          <div class="filter-item" v-for="type in workTypes" :key="type" :class="{ active: activeType === type }" @click="selectType(type)">
            {{ type }}
          </div>
        </div>
      </div>

      <div class="job-list">
        <div class="job-card" v-for="job in jobList" :key="job.id" @click="goDetail(job.id)">
          <div class="job-header">
            <span class="job-title">{{ job.title }}</span>
            <span class="job-salary">{{ formatSalary(job) }}</span>
          </div>
          <div class="job-tags">
            <span class="tag time-tag">⏰ {{ job.work_start_time }} - {{ job.work_end_time }}</span>
            <span class="tag" v-if="job.work_type">{{ job.work_type }}</span>
          </div>
          <div class="job-footer">
            <span class="company-name">{{ job.companyProfile?.company_name || '企业直招' }}</span>
            <span class="job-address">📍 {{ job.address }}</span>
          </div>
        </div>

        <div class="loading-text" v-if="loading">加载中...</div>
        <div class="empty" v-if="!loading && jobList.length === 0">
          <span class="empty-text">暂无相关工作</span>
        </div>
      </div>
    </div>

    <TabBar current="jobs" @change="onTabChange" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobList } from '../../api/job'
import { useRouter } from 'vue-router'
import TabBar from '../../components/TabBar.vue'

const router = useRouter()
const jobList = ref([])
const loading = ref(false)
const activeSort = ref('latest')
const activeType = ref('')

const workTypes = ['文案编辑', '手工制作', '客服', '设计', '数据录入', '家政']

onMounted(() => {
  loadJobs()
})

async function loadJobs() {
  loading.value = true
  try {
    const params = {
      page: 1,
      pageSize: 10,
      sort: activeSort.value,
      work_type: activeType.value || undefined
    }
    const res = await getJobList(params)
    jobList.value = res.list
  } catch (err) {
    console.error('加载工作列表失败:', err)
  } finally {
    loading.value = false
  }
}

function changeSort(sort) {
  activeSort.value = sort
  loadJobs()
}

function selectType(type) {
  activeType.value = activeType.value === type ? '' : type
  loadJobs()
}

function goDetail(id) {
  router.push(`/mom/job/${id}`)
}

function onTabChange(tab) {
  if (tab === 'jobs') return
  if (tab === 'applications') {
    router.push('/mom/applications')
  } else if (tab === 'profile') {
    router.push('/mom/profile')
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
</script>

<style scoped lang="scss">
.job-list-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  position: relative;
}

.content-wrap {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px 15px;
  background: #fff;
}

.search-input {
  height: 36px;
  background: #f5f5f5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.search-icon {
  font-size: 14px;
  margin-right: 8px;
}

.search-placeholder {
  font-size: 14px;
  color: #999;
}

.filter-bar {
  background: #fff;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}

.filter-scroll {
  display: flex;
  padding: 10px 15px;
  gap: 10px;
  white-space: nowrap;
}

.filter-item {
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: 15px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  flex-shrink: 0;
  
  &.active {
    background: #FFE5EC;
    color: #FF6B9D;
  }
}

.job-list {
  padding: 10px 15px;
}

.job-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.job-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.job-salary {
  font-size: 15px;
  font-weight: bold;
  color: #FF6B9D;
  white-space: nowrap;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
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
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.company-name {
  font-size: 13px;
  color: #333;
}

.job-address {
  font-size: 12px;
  color: #999;
}

.loading-text, .empty {
  text-align: center;
  padding: 30px;
  font-size: 13px;
  color: #999;
}
</style>
