<template>
  <div class="applications-page">
    <div class="content-wrap">
      <div class="tab-bar">
        <div class="tab-item" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
          全部
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'pending' }" @click="switchTab('pending')">
          待处理
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'accepted' }" @click="switchTab('accepted')">
          已通过
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'rejected' }" @click="switchTab('rejected')">
          已拒绝
        </div>
      </div>

      <div class="application-list">
        <div class="app-card" v-for="app in applicationList" :key="app.id">
          <div class="app-header">
            <span class="job-title">{{ app.job?.title }}</span>
            <span class="app-status" :class="app.status">{{ getStatusText(app.status) }}</span>
          </div>
          <div class="app-info">
            <span class="info-text">⏰ {{ app.job?.work_start_time }} - {{ app.job?.work_end_time }}</span>
            <span class="info-text">💼 {{ app.job?.work_type || '全职' }}</span>
          </div>
          <div class="app-footer">
            <span class="company">{{ app.job?.companyProfile?.company_name || '企业直招' }}</span>
            <span class="apply-time">{{ formatTime(app.created_at) }}</span>
          </div>
        </div>

        <div class="empty" v-if="!loading && applicationList.length === 0">
          <span class="empty-text">暂无申请记录</span>
        </div>
      </div>
    </div>

    <TabBar current="applications" @change="onTabChange" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyApplications } from '../../api/application'
import { useRouter } from 'vue-router'
import TabBar from '../../components/TabBar.vue'

const router = useRouter()
const applicationList = ref([])
const loading = ref(false)
const activeTab = ref('all')

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  loadApplications()
})

function switchTab(tab) {
  activeTab.value = tab
  loadApplications()
}

async function loadApplications() {
  loading.value = true
  try {
    const params = { page: 1, pageSize: 10 }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res = await getMyApplications(params)
    applicationList.value = res.list
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

function onTabChange(tab) {
  if (tab === 'applications') return
  if (tab === 'jobs') {
    router.push('/mom/jobs')
  } else if (tab === 'profile') {
    router.push('/mom/profile')
  }
}
</script>

<style scoped lang="scss">
.applications-page {
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

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 5px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  z-index: 10;
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

.application-list {
  padding: 10px 15px;
}

.app-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
}

.app-header {
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

.app-status {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
  
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
  gap: 15px;
  margin-bottom: 10px;
}

.info-text {
  font-size: 13px;
  color: #666;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.company {
  font-size: 13px;
  color: #333;
}

.apply-time {
  font-size: 12px;
  color: #999;
}

.empty {
  padding: 60px 0;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #999;
}
</style>
