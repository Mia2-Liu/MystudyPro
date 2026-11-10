<template>
  <div class="resume-page">
    <div class="nav-bar">
      <span class="back-btn" @click="goBack">‹</span>
      <span class="nav-title">我的简历</span>
      <span class="nav-right"></span>
    </div>

    <div class="scroll-content">
      <div class="form-section">
        <div class="section-title">基本信息</div>
        <div class="form-item">
          <span class="label">姓名</span>
          <input class="input" v-model="form.name" placeholder="请输入真实姓名" />
        </div>
        <div class="form-item">
          <span class="label">年龄</span>
          <input class="input" v-model.number="form.age" type="number" placeholder="请输入年龄" />
        </div>
        <div class="form-item">
          <span class="label">期望区域</span>
          <input class="input" v-model="form.area" placeholder="如：朝阳区" />
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">技能标签</div>
        <div class="skills-wrap">
          <div class="skill-tag" :class="{ active: form.skills.includes(skill) }"
            v-for="skill in skillOptions" :key="skill" @click="toggleSkill(skill)">
            {{ skill }}
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">期望薪资（元/时）</div>
        <div class="salary-row">
          <input class="input salary-input" v-model.number="form.expect_salary_min" type="number" placeholder="最低" />
          <span class="salary-line">-</span>
          <input class="input salary-input" v-model.number="form.expect_salary_max" type="number" placeholder="最高" />
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">工作经历</div>
        <textarea class="textarea" v-model="form.experience" placeholder="请描述您的工作经历..."></textarea>
      </div>

      <div class="form-section">
        <div class="section-title">自我介绍</div>
        <textarea class="textarea" v-model="form.intro" placeholder="简单介绍一下自己吧..."></textarea>
      </div>
    </div>

    <div class="footer">
      <button class="save-btn" :disabled="saving" @click="handleSave">
        {{ saving ? '保存中...' : '保存简历' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMomProfile, updateMomProfile } from '../../api/profile'
import { useRouter } from 'vue-router'

const router = useRouter()
const saving = ref(false)

const form = reactive({
  name: '',
  age: '',
  skills: [],
  experience: '',
  expect_salary_min: '',
  expect_salary_max: '',
  area: '',
  intro: ''
})

const skillOptions = ['文案写作', '客服', '手工制作', '设计', '数据录入', '家政服务', '会计', '翻译', '教学辅导', '摄影']

onMounted(() => {
  loadProfile()
})

async function loadProfile() {
  try {
    const res = await getMomProfile()
    if (res) {
      Object.assign(form, {
        name: res.name || '',
        age: res.age || '',
        skills: res.skills || [],
        experience: res.experience || '',
        expect_salary_min: res.expect_salary_min || '',
        expect_salary_max: res.expect_salary_max || '',
        area: res.area || '',
        intro: res.intro || ''
      })
    }
  } catch (err) {
    console.error('加载简历失败:', err)
  }
}

function toggleSkill(skill) {
  const index = form.skills.indexOf(skill)
  if (index > -1) {
    form.skills.splice(index, 1)
  } else {
    form.skills.push(skill)
  }
}

async function handleSave() {
  if (saving.value) return
  saving.value = true

  try {
    await updateMomProfile({
      name: form.name,
      age: form.age || null,
      skills: form.skills,
      experience: form.experience,
      expect_salary_min: form.expect_salary_min || null,
      expect_salary_max: form.expect_salary_max || null,
      area: form.area,
      intro: form.intro
    })
    alert('保存成功！')
    router.back()
  } catch (err) {
    console.error('保存失败:', err)
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.resume-page {
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

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
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
  margin-bottom: 12px;
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

.input {
  flex: 1;
  font-size: 14px;
  color: #333;
  border: none;
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

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  padding: 6px 14px;
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

.salary-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.salary-input {
  width: 80px;
  text-align: center;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  border: none;
}

.salary-line {
  color: #999;
  font-size: 14px;
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

.save-btn {
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
