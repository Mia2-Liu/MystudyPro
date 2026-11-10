<template>
  <div class="applicants-page">
    <div class="nav-bar">
      <span class="back-btn" @click="goBack">‹</span>
      <span class="nav-title">申请者列表</span>
      <span class="nav-right"></span>
    </div>

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

    <div class="applicant-list">
      <div class="applicant-card" v-for="app in applicantList" :key="app.id">
        <div class="applicant-header">
          <div class="user-info">
            <div class="avatar">
              <span>{{ app.momProfile?.name?.charAt(0) || '求' }}</span>
            </div>
            <div class="info-detail">
              <span class="name">{{ app.momProfile?.name || '匿名用户' }}</span>
              <span class="meta">{{ app.momProfile?.age || '--' }}岁 · {{ app.momProfile?.area || '不限区域' }}</span>
            </div>
          </div>
          <span class="app-status" :class="app.status">{{ getStatusText(app.status) }}</span>
        </div>

        <div class="applicant-skills" v-if="app.momProfile?.skills && app.momProfile.skills.length">
          <span class="skill-tag" v-for="(skill, index) in app.momProfile.skills.slice(0, 4)" :key="index">{{ skill }}</span>
        </div>

        <div class="applicant-message" v-if="app.message">
          <span class="message-label">申请留言：</span>
          <span class="message-text">{{ app.message }}</span>
        </div>

        <div class="applicant-actions" v-if="app.status === 'pending'">
          <button class="action-btn reject" @click="handleAction(app, 'rejected')">
            拒绝
          </button>
          <button class="action-btn accept" @click="handleAction(app, 'accepted')">
            通过
          </button>
        </div>
      </div>

      <div class="empty" v-if="!loading && applicantList.length === 0">
        <span class="empty-text">暂无申请者</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobApplications, handleApplication } from '../../api/application'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const applicantList = ref([])
const loading = ref(false)
const activeTab = ref('all')

onMounted(() => {
  loadApplicants()
})

function switchTab(tab) {
  activeTab.value = tab
  loadApplicants()
}

async function loadApplicants() {
  loading.value = true
  try {
    const params = {
      job_id: route.params.jobId,
      page: 1,
      pageSize: 20
    }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res = await getJobApplications(params)
    applicantList.value = res.list
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
  
  if (confirm(`确定要${actionText}该申请吗？`)) {
    try {
      await handleApplication(app.id, status)
      app.status = status
      alert(`已${actionText}！`)
    } catch (err) {
      console.error('操作失败:', err)
    }
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.applicants-page {
  height: 100%;
  background: #f8f8f8;
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

.applicant-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
}

.applicant-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
}

.applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.info-detail {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.meta {
  font-size: 12px;
  color: #999;
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

.applicant-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.skill-tag {
  padding: 3px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  color: #666;
}

.applicant-message {
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
}

.message-label {
  font-size: 12px;
  color: #999;
}

.message-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.applicant-actions {
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
  border: none;
  cursor: pointer;
  
  &.accept {
    background: #52C41A;
    color: #fff;
  }
  
  &.reject {
    background: #f5f5f5;
    color: #666;
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
</style>
