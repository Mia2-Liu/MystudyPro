<template>
  <div class="publish-page">
    <div class="nav-bar">
      <span class="back-btn" @click="goBack">‹</span>
      <span class="nav-title">发布工作</span>
      <span class="nav-right"></span>
    </div>

    <div class="scroll-content">
      <div class="form-section">
        <div class="section-title">基本信息</div>
        <div class="form-item">
          <span class="label">工作标题</span>
          <input class="input" v-model="form.title" placeholder="如：文案编辑兼职" />
        </div>
        <div class="form-item">
          <span class="label">工作类型</span>
          <select class="select" v-model="form.work_type">
            <option value="">请选择</option>
            <option v-for="t in workTypeOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="form-item">
          <span class="label">招聘人数</span>
          <input class="input" v-model.number="form.people_count" type="number" placeholder="请输入招聘人数" />
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">
          工作时间
          <span class="time-tip">（仅限早8:00 - 晚16:00之间）</span>
        </div>
        <div class="form-item">
          <span class="label">开始时间</span>
          <input class="input" type="time" v-model="form.work_start_time" min="08:00" max="15:00" />
        </div>
        <div class="form-item">
          <span class="label">结束时间</span>
          <input class="input" type="time" v-model="form.work_end_time" min="09:00" max="16:00" />
        </div>
        <div class="form-item">
          <span class="label">工作日</span>
          <div class="week-days">
            <div class="day-item" :class="{ active: form.work_days.includes(day.value) }"
              v-for="day in weekDays" :key="day.value" @click="toggleDay(day.value)">
              {{ day.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">薪资待遇</div>
        <div class="form-item">
          <span class="label">薪资类型</span>
          <select class="select" v-model="form.salary_type">
            <option value="hourly">时薪</option>
            <option value="daily">日薪</option>
            <option value="monthly">月薪</option>
            <option value="project">项目制</option>
          </select>
        </div>
        <div class="form-item">
          <span class="label">薪资范围</span>
          <div class="salary-row">
            <input class="input salary-input" v-model.number="form.salary_min" type="number" placeholder="最低" />
            <span class="salary-line">-</span>
            <input class="input salary-input" v-model.number="form.salary_max" type="number" placeholder="最高" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">工作地点</div>
        <div class="form-item">
          <span class="label">详细地址</span>
          <input class="input" v-model="form.address" placeholder="请输入工作地址" />
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">工作内容</div>
        <textarea class="textarea" v-model="form.content" placeholder="请详细描述工作内容..."></textarea>
      </div>

      <div class="form-section">
        <div class="section-title">任职要求</div>
        <textarea class="textarea" v-model="form.requirements" placeholder="请描述任职要求..."></textarea>
      </div>

      <div class="form-section">
        <div class="section-title">福利待遇</div>
        <div class="benefits-wrap">
          <div class="benefit-tag" :class="{ active: form.benefits.includes(benefit) }"
            v-for="benefit in benefitOptions" :key="benefit" @click="toggleBenefit(benefit)">
            {{ benefit }}
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <button class="publish-btn" :disabled="publishing" @click="handlePublish">
        {{ publishing ? '发布中...' : '立即发布' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { createJob } from '../../api/job'
import { useRouter } from 'vue-router'

const router = useRouter()
const publishing = ref(false)

const form = reactive({
  title: '',
  work_type: '',
  people_count: 1,
  work_start_time: '09:00',
  work_end_time: '15:00',
  work_days: [1, 2, 3, 4, 5],
  salary_type: 'hourly',
  salary_min: '',
  salary_max: '',
  address: '',
  content: '',
  requirements: '',
  benefits: []
})

const workTypeOptions = ['文案编辑', '手工制作', '客服', '设计', '数据录入', '家政服务', '其他']

const weekDays = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 }
]

const benefitOptions = ['包午餐', '弹性工作', '日结工资', '周末休息', '节日福利', '免费下午茶', '远程办公', '提成奖励']

function toggleDay(day) {
  const index = form.work_days.indexOf(day)
  if (index > -1) {
    form.work_days.splice(index, 1)
  } else {
    form.work_days.push(day)
  }
}

function toggleBenefit(benefit) {
  const index = form.benefits.indexOf(benefit)
  if (index > -1) {
    form.benefits.splice(index, 1)
  } else {
    form.benefits.push(benefit)
  }
}

async function handlePublish() {
  if (!form.title) {
    alert('请输入工作标题')
    return
  }
  if (!form.work_start_time || !form.work_end_time) {
    alert('请选择工作时间')
    return
  }
  if (publishing.value) return

  publishing.value = true
  try {
    await createJob({
      ...form,
      salary_min: form.salary_min || null,
      salary_max: form.salary_max || null,
      people_count: form.people_count || 1
    })
    alert('发布成功！')
    router.back()
  } catch (err) {
    console.error('发布失败:', err)
  } finally {
    publishing.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.publish-page {
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

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 70px;
}

.form-section {
  background: #fff;
  margin-bottom: 10px;
  padding: 15px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.time-tip {
  font-size: 11px;
  color: #FF6B9D;
  font-weight: normal;
  margin-left: 5px;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 80px;
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.input, .select {
  flex: 1;
  font-size: 14px;
  color: #333;
  border: none;
  background: transparent;
}

.select {
  appearance: none;
  background: transparent;
}

.textarea {
  width: 100%;
  height: 100px;
  font-size: 14px;
  color: #333;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  border: none;
  resize: none;
}

.week-days {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.day-item {
  padding: 5px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  
  &.active {
    background: #FFE5EC;
    color: #FF6B9D;
  }
}

.salary-row {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.salary-input {
  width: 80px;
  text-align: center;
  padding: 6px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  border: none;
}

.salary-line {
  color: #999;
  font-size: 14px;
}

.benefits-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.benefit-tag {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 15px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  
  &.active {
    background: #FFE5EC;
    color: #FF6B9D;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.publish-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #FF6B9D, #FF8FAB);
  color: #fff;
  font-size: 16px;
  border-radius: 22px;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
  }
}
</style>
