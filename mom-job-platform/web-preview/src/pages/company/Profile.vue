<template>
  <div class="company-profile">
    <div class="content-wrap">
      <div class="header">
        <div class="company-icon">
          <span>🏢</span>
        </div>
        <div class="company-info">
          <span class="company-name">{{ profile.company_name || '未设置企业名称' }}</span>
          <span class="verified-tag" :class="verifyStatusClass">
            {{ verifyStatusText }}
          </span>
        </div>
      </div>

      <div class="verify-section">
        <div class="section-title">企业资质认证</div>
        <div class="verify-tip">
          <span class="tip-icon">💡</span>
          <span class="tip-text">上传营业执照，完成企业认证后，发布的职位将获得"已认证"标识，更值得信赖。</span>
        </div>

        <div class="form-item">
          <span class="label">企业名称 <i class="required">*</i></span>
          <input class="input" v-model="verifyForm.company_name" placeholder="请输入营业执照上的企业名称" />
        </div>

        <div class="upload-item">
          <span class="label">营业执照 <i class="required">*</i></span>
          <div class="upload-area" @click="triggerUpload">
            <div v-if="verifyForm.business_license" class="preview-img">
              <img :src="verifyForm.business_license" alt="营业执照" />
              <span class="reupload">点击重新上传</span>
            </div>
            <div v-else class="upload-placeholder">
              <span class="upload-icon">📄</span>
              <span class="upload-text">点击上传营业执照</span>
              <span class="upload-hint">支持 JPG、PNG 格式</span>
            </div>
          </div>
          <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
        </div>

        <div v-if="profile.verify_status === 3 && profile.verify_remark" class="reject-reason">
          <span class="reject-label">审核不通过原因：</span>
          <span class="reject-text">{{ profile.verify_remark }}</span>
        </div>

        <button 
          class="verify-btn" 
          :disabled="submitting || profile.verify_status === 1 || profile.verify_status === 2"
          @click="handleSubmitVerify"
        >
          {{ verifyBtnText }}
        </button>
      </div>

      <div class="form-section">
        <div class="section-title">企业信息</div>
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
    </div>

    <div class="footer-bar">
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
import { ref, reactive, onMounted, computed } from 'vue'
import { getCompanyProfile, updateCompanyProfile, submitVerification } from '../../api/profile'
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const saving = ref(false)
const submitting = ref(false)
const fileInput = ref(null)

const profile = reactive({
  company_name: '',
  contact_name: '',
  contact_phone: '',
  address: '',
  industry: '',
  scale: '',
  intro: '',
  verified: 0,
  verify_status: 0,
  verify_remark: '',
  business_license: ''
})

const verifyForm = reactive({
  company_name: '',
  business_license: ''
})

const verifyStatusText = computed(() => {
  const map = { 0: '未认证', 1: '审核中', 2: '已认证', 3: '认证失败' }
  return map[profile.verify_status] || '未认证'
})

const verifyStatusClass = computed(() => {
  return {
    verified: profile.verify_status === 2,
    pending: profile.verify_status === 1,
    rejected: profile.verify_status === 3
  }
})

const verifyBtnText = computed(() => {
  if (profile.verify_status === 1) return '审核中，请耐心等待'
  if (profile.verify_status === 2) return '已通过认证'
  if (profile.verify_status === 3) return '重新提交认证'
  return '提交认证'
})

onMounted(() => {
  loadProfile()
})

async function loadProfile() {
  try {
    const res = await getCompanyProfile()
    if (res) {
      Object.assign(profile, res)
      verifyForm.company_name = res.company_name || ''
      verifyForm.business_license = res.business_license || ''
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

function triggerUpload() {
  if (profile.verify_status === 1 || profile.verify_status === 2) return
  fileInput.value?.click()
}

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    verifyForm.business_license = e.target.result
  }
  reader.readAsDataURL(file)
}

async function handleSubmitVerify() {
  if (submitting.value) return
  if (profile.verify_status === 1 || profile.verify_status === 2) return

  if (!verifyForm.company_name.trim()) {
    alert('请输入企业名称')
    return
  }
  if (!verifyForm.business_license) {
    alert('请上传营业执照')
    return
  }

  submitting.value = true
  try {
    const res = await submitVerification(verifyForm)
    Object.assign(profile, res)
    alert('认证提交成功，等待审核！')
  } catch (err) {
    console.error('提交认证失败:', err)
  } finally {
    submitting.value = false
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
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.content-wrap {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
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
  &.pending {
    background: #FAAD14;
  }
  &.rejected {
    background: #FF4D4F;
  }
}

.verify-section {
  background: #fff;
  margin: 10px 0;
  padding: 15px;
}

.verify-tip {
  display: flex;
  align-items: flex-start;
  background: #E6F7FF;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 15px;

  .tip-icon {
    margin-right: 6px;
    font-size: 14px;
  }
  .tip-text {
    flex: 1;
    font-size: 12px;
    color: #1890FF;
    line-height: 1.5;
  }
}

.upload-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;

  .label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
}

.required {
  color: #FF4D4F;
  font-style: normal;
  margin-left: 2px;
}

.upload-area {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border-color: #4A90E2;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  .upload-icon {
    font-size: 36px;
  }
  .upload-text {
    font-size: 14px;
    color: #333;
  }
  .upload-hint {
    font-size: 12px;
    color: #999;
  }
}

.preview-img {
  position: relative;

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 6px;
  }
  .reupload {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #4A90E2;
  }
}

.reject-reason {
  background: #FFF1F0;
  padding: 10px 12px;
  border-radius: 6px;
  margin: 10px 0;

  .reject-label {
    font-size: 13px;
    color: #FF4D4F;
    font-weight: 500;
  }
  .reject-text {
    font-size: 13px;
    color: #FF4D4F;
  }
}

.verify-btn {
  width: 100%;
  height: 42px;
  background: linear-gradient(90deg, #52C41A, #73D13D);
  color: #fff;
  font-size: 15px;
  border-radius: 21px;
  border: none;
  cursor: pointer;
  margin-top: 15px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

.footer-bar {
  flex-shrink: 0;
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
  flex-shrink: 0;
  width: 100%;
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
