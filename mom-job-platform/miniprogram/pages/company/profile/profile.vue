<template>
  <view class="company-profile">
    <view class="header">
      <view class="company-icon">
        <text class="icon-text">🏢</text>
      </view>
      <view class="company-info">
        <text class="company-name">{{ profile.company_name || '未设置企业名称' }}</text>
        <text class="verified-tag" :class="{ verified: profile.verified }">
          {{ profile.verified ? '已认证' : '未认证' }}
        </text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-title">企业信息</view>
      <view class="form-item">
        <text class="label">企业名称</text>
        <input class="input" v-model="profile.company_name" placeholder="请输入企业名称" />
      </view>
      <view class="form-item">
        <text class="label">联系人</text>
        <input class="input" v-model="profile.contact_name" placeholder="请输入联系人姓名" />
      </view>
      <view class="form-item">
        <text class="label">联系电话</text>
        <input class="input" v-model="profile.contact_phone" type="number" placeholder="请输入联系电话" />
      </view>
      <view class="form-item">
        <text class="label">所属行业</text>
        <input class="input" v-model="profile.industry" placeholder="如：互联网/教育" />
      </view>
      <view class="form-item">
        <text class="label">企业规模</text>
        <input class="input" v-model="profile.scale" placeholder="如：20-99人" />
      </view>
      <view class="form-item">
        <text class="label">企业地址</text>
        <input class="input" v-model="profile.address" placeholder="请输入详细地址" />
      </view>
    </view>

    <view class="form-section">
      <view class="section-title">企业介绍</view>
      <textarea class="textarea" v-model="profile.intro" placeholder="请介绍一下你的企业..." />
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleLogout">
        <text class="menu-icon">🚪</text>
        <text class="menu-title logout">退出登录</text>
      </view>
    </view>

    <view class="footer">
      <button class="save-btn" :disabled="saving" @click="handleSave">
        {{ saving ? '保存中...' : '保存信息' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanyProfile, updateCompanyProfile } from '../../../api/profile'
import { useUserStore } from '../../../store/user'

const userStore = useUserStore()
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
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
  } catch (err) {
    console.error('保存失败:', err)
  } finally {
    saving.value = false
  }
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.company-profile {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 160rpx;
}

.header {
  background: linear-gradient(135deg, #4A90E2, #67B8F7);
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
}

.company-icon {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.icon-text {
  font-size: 48rpx;
}

.company-info {
  flex: 1;
}

.company-name {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10rpx;
}

.verified-tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 22rpx;
  border-radius: 20rpx;
  
  &.verified {
    background: #52C41A;
  }
}

.form-section {
  background: #fff;
  margin: 20rpx 0;
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
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
  width: 180rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.input {
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

.menu-section {
  margin: 20rpx 0;
  background: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 24rpx;
}

.menu-title {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  
  &.logout {
    color: #FF4D4F;
    text-align: center;
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

.save-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(90deg, #4A90E2, #67B8F7);
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
