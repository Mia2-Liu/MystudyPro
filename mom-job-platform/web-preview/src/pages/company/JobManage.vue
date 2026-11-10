<template>
  <div class="job-manage-page">
    <div class="nav-bar">
      <span class="back-btn" @click="goBack">‹</span>
      <span class="nav-title">工作管理</span>
      <span class="nav-right"></span>
    </div>

    <div class="tab-bar">
      <div class="tab-item" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
        全部
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'active' }" @click="switchTab('active')">
        招聘中
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'inactive' }" @click="switchTab('inactive')">
        已下架
      </div>
    </div>

    <div class="job-list">
      <div class="job-card" v-for="job in jobList" :key="job.id">
        <div class="job-header">
          <span class="job-title">{{ job.title }}</span>
          <span class="job-status" :class="job.status === 1 ? 'active' : 'inactive'">
            {{ job.status === 1 ? '招聘中' : '已下架' }}
          </span>
        </div>
        <div class="job-info">
          <span class="info-text">⏰ {{ job.work_start_time }} - {{ job.work_end_time }}</span>
          <span class="info-text">👥 {{ job.apply_count }}人申请</span>
        </div>
        <div class="job-actions">
          <button class="action-btn primary" size="mini" @click="goApplicants(job.id)">
            查看申请
          </button>
          <button class="action-btn" size="mini" @click="toggleStatus(job)">
            {{ job.status === 1 ? '下架' : '上架' }}
          </button>
        </div>
      </div>

      <div class="empty" v-if="!loading && jobList.length === 0">
        <span class="empty-text">暂无工作</span>
      </div>
    </div>

    <div class="fab-btn" @click="goPublish">
      <span class="fab-icon">+</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCompanyJobs, toggleJobStatus } from '../../api/job'
import { useRouter } from 'vue-router'

const router = useRouter()
const jobList = ref([])
const loading = ref(false)
const activeTab = ref('all')

onMounted(() => {
  loadJobs()
})

function switchTab(tab) {
  activeTab.value = tab
  loadJobs()
}

async function loadJobs() {
  loading.value = true
  try {
    let status
    if (activeTab.value === 'active') status = 1
    if (activeTab.value === 'inactive') status = 0
    
    const res = await getCompanyJobs({ page: 1, pageSize: 20, status })
    jobList.value = res.list
  } catch (err) {
    console.error('加载失败:', err)
  } finally {
    loading.value = false
  }
}

async function toggleStatus(job) {
  const newStatus = job.status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '上架' : '下架'
  
  if (confirm(`确定要${actionText}该工作吗？`)) {
    try {
      await toggleJobStatus(job.id, newStatus)
      job.status = newStatus
      alert(`${actionText}成功！`)
    } catch (err) {
      console.error('操作失败:', err)
    }
  }
}

function goApplicants(jobId) {
  router.push(`/company/applicants/${jobId}`)
}

function goPublish() {
  router.push('/company/publish')
}

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.job-manage-page {
  height: 100%;
  background: #f8f8f8;
  position: relative;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.back-btn {
  font-size: 28px;
  color: #333;
  cursor: pointer;
  width: 40px;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.nav-right {
  width: 40px;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 5px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 14px;
  color: #666;
  position: relative;
  cursor: pointer;
  
  &.active {
    color: #FF6B9D;
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 3px;
      background: #FF6B9D;
      border-radius: 2px;
    }
  }
}

.job-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
}

.job-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.job-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.job-status {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
  
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
  gap: 15px;
  margin-bottom: 12px;
}

.info-text {
  font-size: 13px;
  color: #666;
}

.job-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.action-btn {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 15px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  
  &.primary {
    background: #FF6B9D;
    color: #fff;
    border: none;
  }
}

.empty {
  padding: 60px 0;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.fab-btn {
  position: absolute;
  right: 20px;
  bottom: 60px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
  z-index: 100;
  cursor: pointer;
}

.fab-icon {
  font-size: 24px;
  color: #fff;
  line-height: 1;
}
</style>
