<template>
  <view class="publish-page">
    <scroll-view scroll-y class="scroll-container">
      <view class="form-section">
        <view class="section-title">基本信息</view>
        <view class="form-item">
          <text class="label">工作标题</text>
          <input class="input" v-model="form.title" placeholder="如：文案编辑兼职" />
        </view>
        <view class="form-item">
          <text class="label">工作类型</text>
          <picker :range="workTypeOptions" @change="onWorkTypeChange">
            <view class="picker-value">
              {{ form.work_type || '请选择工作类型' }}
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">招聘人数</text>
          <input class="input" v-model="form.people_count" type="number" placeholder="请输入招聘人数" />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">
          工作时间
          <text class="time-tip">（仅限早8:00 - 晚16:00之间）</text>
        </view>
        <view class="form-item">
          <text class="label">开始时间</text>
          <picker mode="time" value="09:00" start="08:00" end="15:00" @change="onStartTimeChange">
            <view class="picker-value">{{ form.work_start_time || '请选择开始时间' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">结束时间</text>
          <picker mode="time" value="15:00" start="09:00" end="16:00" @change="onEndTimeChange">
            <view class="picker-value">{{ form.work_end_time || '请选择结束时间' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">工作日</text>
          <view class="week-days">
            <view class="day-item" :class="{ active: form.work_days.includes(day.value) }"
              v-for="day in weekDays" :key="day.value" @click="toggleDay(day.value)">
              {{ day.label }}
            </view>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">薪资待遇</view>
        <view class="form-item">
          <text class="label">薪资类型</text>
          <picker :range="salaryTypeLabels" @change="onSalaryTypeChange">
            <view class="picker-value">{{ salaryTypeMap[form.salary_type] || '请选择' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">薪资范围</text>
          <view class="salary-row">
            <input class="input salary-input" v-model="form.salary_min" type="digit" placeholder="最低" />
            <text class="salary-line">-</text>
            <input class="input salary-input" v-model="form.salary_max" type="digit" placeholder="最高" />
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">工作地点</view>
        <view class="form-item">
          <text class="label">详细地址</text>
          <input class="input" v-model="form.address" placeholder="请输入工作地址" />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">工作内容</view>
        <textarea class="textarea" v-model="form.content" placeholder="请详细描述工作内容..." />
      </view>

      <view class="form-section">
        <view class="section-title">任职要求</view>
        <textarea class="textarea" v-model="form.requirements" placeholder="请描述任职要求..." />
      </view>

      <view class="form-section">
        <view class="section-title">福利待遇</view>
        <view class="benefits-wrap">
          <view class="benefit-tag" :class="{ active: form.benefits.includes(benefit) }"
            v-for="benefit in benefitOptions" :key="benefit" @click="toggleBenefit(benefit)">
            {{ benefit }}
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <button class="publish-btn" :disabled="publishing" @click="handlePublish">
        {{ publishing ? '发布中...' : '立即发布' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { createJob } from '../../../api/job'

const publishing = ref(false)

const form = reactive({
  title: '',
  work_type: '',
  people_count: 1,
  work_start_time: '',
  work_end_time: '',
  work_days: [],
  salary_type: 'hourly',
  salary_min: '',
  salary_max: '',
  address: '',
  content: '',
  requirements: '',
  benefits: []
})

const workTypeOptions = ['文案编辑', '手工制作', '客服', '设计', '数据录入', '家政服务', '其他']

const salaryTypeMap = {
  hourly: '时薪',
  daily: '日薪',
  monthly: '月薪',
  project: '项目制'
}
const salaryTypeLabels = Object.values(salaryTypeMap)
const salaryTypeKeys = Object.keys(salaryTypeMap)

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

function onWorkTypeChange(e) {
  form.work_type = workTypeOptions[e.detail.value]
}

function onStartTimeChange(e) {
  form.work_start_time = e.detail.value
}

function onEndTimeChange(e) {
  form.work_end_time = e.detail.value
}

function onSalaryTypeChange(e) {
  form.salary_type = salaryTypeKeys[e.detail.value]
}

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
    uni.showToast({ title: '请输入工作标题', icon: 'none' })
    return
  }
  if (!form.work_start_time || !form.work_end_time) {
    uni.showToast({ title: '请选择工作时间', icon: 'none' })
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
    uni.showToast({
      title: '发布成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (err) {
    console.error('发布失败:', err)
  } finally {
    publishing.value = false
  }
}
</script>

<style lang="scss" scoped>
.publish-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.scroll-container {
  flex: 1;
  padding-bottom: 140rpx;
}

.form-section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.time-tip {
  font-size: 22rpx;
  color: #FF6B9D;
  font-weight: normal;
  margin-left: 10rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.picker-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.textarea {
  width: 100%;
  height: 200rpx;
  font-size: 28rpx;
  color: #333;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.week-days {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.day-item {
  padding: 10rpx 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666;
  
  &.active {
    background: #FFE5EC;
    color: #FF6B9D;
  }
}

.salary-row {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.salary-input {
  width: 160rpx;
  text-align: center;
  padding: 12rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.salary-line {
  color: #999;
  font-size: 28rpx;
}

.benefits-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.benefit-tag {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #666;
  
  &.active {
    background: #FFE5EC;
    color: #FF6B9D;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.publish-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(90deg, #FF6B9D, #FF8FAB);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
  
  &[disabled] {
    opacity: 0.6;
  }
  
  &::after {
    border: none;
  }
}
</style>
