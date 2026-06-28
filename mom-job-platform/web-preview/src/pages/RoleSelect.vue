<template>
  <div class="role-select-container">
    <div class="header">
      <span class="title">请选择您的身份</span>
      <span class="subtitle">选择后不可更改，请谨慎选择</span>
    </div>

    <div class="role-list">
      <div class="role-card" :class="{ active: selectedRole === 'mom' }" @click="selectedRole = 'mom'">
        <div class="role-icon mom-icon">
          <span>👩</span>
        </div>
        <div class="role-info">
          <span class="role-title">我是全职妈妈</span>
          <span class="role-desc">找一份早8晚4的工作，兼顾家庭与事业</span>
        </div>
        <div class="check-icon" v-if="selectedRole === 'mom'">✓</div>
      </div>

      <div class="role-card" :class="{ active: selectedRole === 'company' }" @click="selectedRole = 'company'">
        <div class="role-icon company-icon">
          <span>🏢</span>
        </div>
        <div class="role-info">
          <span class="role-title">我是用人企业</span>
          <span class="role-desc">发布工作需求，招聘优秀的宝妈人才</span>
        </div>
        <div class="check-icon" v-if="selectedRole === 'company'">✓</div>
      </div>
    </div>

    <div class="footer">
      <button class="confirm-btn" :disabled="!selectedRole || loading" @click="confirmRole">
        {{ loading ? '提交中...' : '确认选择' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const selectedRole = ref('')
const loading = ref(false)

async function confirmRole() {
  if (!selectedRole.value || loading.value) return
  
  loading.value = true
  try {
    await userStore.setRoleAction(selectedRole.value)
    
    if (selectedRole.value === 'mom') {
      router.push('/mom/jobs')
    } else {
      router.push('/company/index')
    }
  } catch (err) {
    console.error('设置角色失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.role-select-container {
  height: 100%;
  min-height: 676px;
  background: #f8f8f8;
  padding: 30px 20px;
  box-sizing: border-box;
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #999;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.role-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 15px;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  transition: all 0.3s;
  position: relative;
  
  &.active {
    border-color: #FF6B9D;
    background: #FFF5F8;
  }
}

.role-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.mom-icon {
  background: linear-gradient(135deg, #FF6B9D, #FF8FAB);
}

.company-icon {
  background: linear-gradient(135deg, #4A90E2, #67B8F7);
}

.role-info {
  flex: 1;
}

.role-title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.role-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.check-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: #FF6B9D;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  position: absolute;
  bottom: 30px;
  left: 20px;
  right: 20px;
}

.confirm-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #FF6B9D, #FF8FAB);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
