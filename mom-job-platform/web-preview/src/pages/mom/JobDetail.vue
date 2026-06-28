<template>
  <div class="job-detail-page" v-if="job">
    <div class="nav-bar">
      <span class="back-btn" @click="goBack">‹</span>
      <span class="nav-title">工作详情</span>
      <span class="nav-right"></span>
    </div>

    <div class="scroll-content">
      <div class="job-header">
        <span class="job-title">{{ job.title }}</span>
        <span class="job-salary">{{ formatSalary(job) }}</span>
      </div>

      <div class="job-info">
        <div class="info-item">
          <span class="label">⏰ 工作时间</span>
          <span class="value">{{ job.work_start_time }} - {{ job.work_end_time }}</span>
        </div>
        <div class="info-item" v-if="job.work_days && job.work_days.length">
          <span class="label">📅 工作日</span>
          <span class="value">{{ formatWorkDays(job.work_days) }}</span>
        </div>
        <div class="info-item">
          <span class="label">📍 工作地点</span>
          <span class="value">{{ job.address || '待定' }}</span>
        </div>
        <div class="info-item" v-if="job.work_type">
          <span class="label">💼 工作类型</span>
          <span class="value">{{ job.work_type }}</span>
        </div>
        <div class="info-item">
          <span class="label">👥 招聘人数</span>
          <span class="value">{{ job.people_count }}人</span>
        </div>
      </div>

      <div class="section" v-if="job.content">
        <span class="section-title">工作内容</span>
        <span class="section-content">{{ job.content }}</span>
      </div>

      <div class="section" v-if="job.requirements">
        <span class="section-title">任职要求</span>
        <span class="section-content">{{ job.requirements }}</span>
      </div>

      <div class="section" v-if="job.benefits && job.benefits.length">
        <span class="section-title">福利待遇</span>
        <div class="benefits-list">
          <span class="benefit-tag" v-for="(item, index) in job.benefits" :key="index">{{ item }}</span>
        </div>
      </div>

      <div class="section company-section" v-if="job.companyProfile">
        <span class="section-title">企业信息</span>
        <div class="company-info">
          <span class="company-name">{{ job.companyProfile.company_name }}</span>
          <span class="company-desc" v-if="job.companyProfile.industry">{{ job.companyProfile.industry }} · {{ job.companyProfile.scale }}</span>
          <span class="company-intro" v-if="job.companyProfile.intro">{{ job.companyProfile.intro }}</span>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <button class="apply-btn" :disabled="applying" @click="handleApply">
        {{ applying ? '申请中...' : '立即申请' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobDetail } from '../../api/job'
import { applyJob } from '../../api/application'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const job = ref(null)
const applying = ref(false)

onMounted(() => {
  loadDetail()
})

async function loadDetail() {
  try {
    const res = await getJobDetail(route.params.id)
    job.value = res
  } catch (err) {
    console.error('获取详情失败:', err)
  }
}

function goBack() {
  router.back()
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
  if (applying.value) return

  const token = localStorage.getItem('token')
  if (!token) {
    alert('请先登录')
    router.push('/login')
    return
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  if (userInfo.role !== 'mom') {
    alert('只有全职妈妈账号才能申请工作')
    return
  }

  applying.value = true

  try {
    await applyJob(route.params.id, '')
    alert('申请成功！')
  } catch (err) {
    console.error('申请失败:', err)
  } finally {
    applying.value = false
  }
}
</script>

<style scoped lang="scss">
.job-detail-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  position: relative;
}

.nav-bar {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
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

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.job-header {
  background: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
}

.job-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.job-salary {
  font-size: 18px;
  font-weight: bold;
  color: #FF6B9D;
}

.job-info {
  background: #fff;
  padding: 5px 15px;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
  text-align: right;
  max-width: 60%;
}

.section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.section-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.benefits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.benefit-tag {
  padding: 5px 10px;
  background: #FFF5F8;
  color: #FF6B9D;
  font-size: 12px;
  border-radius: 4px;
}

.company-section {
  margin-bottom: 30px;
}

.company-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.company-desc {
  display: block;
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.company-intro {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.footer-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.apply-btn {
  width: 150px;
  height: 40px;
  background: linear-gradient(90deg, #FF6B9D, #FF8FAB);
  color: #fff;
  font-size: 15px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
  }
}
</style>
