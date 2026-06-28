<template>
  <div class="company-profile">
    <div class="header">
      <div class="company-icon">
        <span>🏢</span>
      </div>
      <div class="company-info">
        <span class="company-name">{{ profile.company_name || '未设置企业名称' }}</span>
        <span class="verified-tag" :class="{ verified: profile.verified }">
          {{ profile.verified ? '已认证' : '未认证' }}
        </span>
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">企业信息</div>
      <div class="form-item">
        <span class="label">企业名称</span>
        <input class="input" v-model="profile.company_name" placeholder="请输入企业名称" />
      </div>
      <div class="form-item">
        <span class="label">联系人</span>
        <input class="input" v-model="profile.contact_name" placeholder="请输入联系人姓名" />
      </div>
      <div class="form-item">
        <span class="label">联系电话</span>
        <input class="input" v-model="profile.contact_phone" placeholder="请输入联系电话" />
      </div>
      <div class="form-item">
        <span class="label">所属行业</span>
        <input class="input" v-model="profile.industry" placeholder="如：互联网/教育" />
      </div>
      <div class="form-item">
        <span class="label">企业规模</span>
        <input class="input" v-model="profile.scale" placeholder="如：20-99人" />
      </div>
      <div class="form-item">
        <span class="label">企业地址</span>
        <input class="input" v-model="profile.address" placeholder="请输入详细地址" />
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">企业介绍</div>
      <textarea class="textarea" v-model="profile.intro" placeholder="请介绍一下你的企业..."></textarea>
    </div>

    <div class="menu-section">
      <div class="menu-item" @click="handleLogout">
        <span class="menu-icon">🚪</span>
        <span class="menu-title logout">退出登录</span>
      </div>
    </div>

    <div class="footer">
      <button class="save-btn" :disabled="saving" @click="handleSave">
        {{ saving ? '保存中...' : '保存信息' }}
      </button>
    </div>

    <div class="bottom-nav">
      <div class="nav-item" @click="goIndex">
        <span>🏠</span>
        <span>工作台</span>
      </div>
      <div class="nav-item active">
        <span>👤</span>
        <span>企业中心</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanyProfile, updateCompanyProfile } from '../../api/profile'
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const saving = ref(false)

const profile = reactive({
  company_name: '',
  contact_name: '',
  contact_phone: '',
  address: '',
  industry: '',
  scale: '',
  intro: '',
  verified: 0
})

onMounted(() => {
  loadProfile()
})

async function loadProfile() {
  try {
    const res = await getCompanyProfile()
    if (res) {
      Object.assign(profile, res)
    }
  } catch (err) {
    console.error('加载企业信息失败:', err)
  }
}

async function handleSave() {
  if (saving.value) return
  saving.value = true

  try {
    await updateCompanyProfile(profile)
    alert('保存成功！')
  } catch (err) {
    console.error('保存失败:', err)
  } finally {
    saving.value = false
  }
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}

function goIndex() {
  router.push('/company/index')
}
</script>

<style scoped lang="scss">
.company-profile {
  height: 100%;
  background: #f8f8f8;
  padding-bottom: 110px;
  position: relative;
  overflow-y: auto;
}

.header {
  background: linear-gradient(135deg, #4A90E2, #67B8F7);
  padding: 30px 15px;
  display: flex;
  align-items: center;
}

.company-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 24px;
}

.company-info {
  flex: 1;
}

.company-name {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
}

.verified-tag {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
  
  &.verified {
    background: #52C41A;
  }
}

.form-section {
  background: #fff;
  margin: 10px 0;
  padding: 15px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
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
  width: 90px;
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

.menu-section {
  margin: 10px 0;
  background: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
}

.menu-title {
  flex: 1;
  font-size: 15px;
  color: #333;
  
  &.logout {
    color: #FF4D4F;
    text-align: center;
  }
}

.footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.save-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #4A90E2, #67B8F7);
  color: #fff;
  font-size: 16px;
  border-radius: 22px;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
  }
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
