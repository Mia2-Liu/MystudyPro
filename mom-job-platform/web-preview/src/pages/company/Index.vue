<template>
  <div class="company-index">
    <div class="header">
      <div class="user-info">
        <span class="company-name">{{ companyInfo.company_name || '完善企业信息' }}</span>
        <span class="company-desc">{{ companyInfo.industry || '点击设置企业资料' }}</span>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <span class="stat-num">{{ stats.total || 0 }}</span>
        <span class="stat-label">发布工作</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ stats.active || 0 }}</span>
        <span class="stat-label">招聘中</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ stats.applications || 0 }}</span>
        <span class="stat-label">新申请</span>
      </div>
    </div>

    <div class="quick-actions">
      <div class="action-card publish" @click="goPublish">
        <span class="action-icon">📢</span>
        <span class="action-title">发布工作</span>
        <span class="action-desc">快速发布招聘需求</span>
      </div>
      <div class="action-card manage" @click="goJobManage">
        <span class="action-icon">📋</span>
        <span class="action-title">工作管理</span>
        <span class="action-desc">管理已发布的工作</span>
      </div>
    </div>

    <div class="recent-section">
      <div class="section-header">
        <span class="section-title">最近发布</span>
        <span class="section-more" @click="goJobManage">查看全部 ›</span>
      </div>

      <div class="job-list">
        <div class="job-item" v-for="job in recentJobs" :key="job.id" @click="goApplicants(job.id)">
          <div class="job-info">
            <span class="job-title">{{ job.title }}</span>
            <span class="job-time">{{ job.work_start_time }} - {{ job.work_end_time }}</span>
          </div>
          <div class="job-right">
            <span class="apply-count">{{ job.apply_count }}人申请</span>
            <span class="job-status" :class="job.status === 1 ? 'active' : 'inactive'">
              {{ job.status === 1 ? '招聘中' : '已下架' }}
            </span>
          </div>
        </div>

        <div class="empty" v-if="recentJobs.length === 0">
          <span class="empty-text">暂无发布的工作</span>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active" @click="goIndex">
        <span>🏠</span>
        <span>工作台</span>
      </div>
      <div class="nav-item" @click="goProfile">
        <span>👤</span>
        <span>企业中心</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanyJobs } from '../../api/job'
import { getCompanyProfile } from '../../api/profile'
import { useRouter } from 'vue-router'

const router = useRouter()
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
  router.push('/company/publish')
}

function goJobManage() {
  router.push('/company/manage')
}

function goApplicants(jobId) {
  router.push(`/company/applicants/${jobId}`)
}

function goIndex() {}
function goProfile() {
  router.push('/company/profile')
}
</script>

<style scoped lang="scss">
.company-index {
  min-height: 100%;
  background: #f8f8f8;
  padding-bottom: 60px;
}

.header {
  background: linear-gradient(135deg, #4A90E2, #67B8F7);
  padding: 40px 15px 30px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.company-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.stat-cards {
  display: flex;
  margin: -15px 15px 15px;
  background: #fff;
  border-radius: 12px;
  padding: 15px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.stat-card {
  flex: 1;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  
  &:last-child {
    border-right: none;
  }
}

.stat-num {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.quick-actions {
  display: flex;
  gap: 10px;
  padding: 0 15px;
  margin-bottom: 15px;
}

.action-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 20px 15px;
  text-align: center;
  cursor: pointer;
  
  &.publish {
    background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
    
    .action-title, .action-desc {
      color: #fff;
    }
  }
}

.action-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 8px;
}

.action-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #999;
}

.recent-section {
  background: #fff;
  margin: 0 15px;
  border-radius: 12px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 13px;
  color: #FF6B9D;
  cursor: pointer;
}

.job-list {
  margin-top: 5px;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
}

.job-info {
  flex: 1;
}

.job-title {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.job-time {
  font-size: 12px;
  color: #999;
}

.job-right {
  text-align: right;
}

.apply-count {
  display: block;
  font-size: 12px;
  color: #FF6B9D;
  margin-bottom: 4px;
}

.job-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  
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
  padding: 30px 0;
  text-align: center;
}

.empty-text {
  font-size: 13px;
  color: #999;
}

.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  display: flex;
  border-top: 1px solid #eee;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  font-size: 11px;
  color: #999;
  
  &.active {
    color: #4A90E2;
  }
  
  span:first-child {
    font-size: 20px;
  }
}
</style>
