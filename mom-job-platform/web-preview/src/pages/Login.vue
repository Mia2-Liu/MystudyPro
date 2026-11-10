<template>
  <div class="login-container">
    <div class="logo-section">
      <div class="logo">
        <span class="logo-text">宝妈兼职</span>
      </div>
      <span class="slogan">灵活工作，兼顾家庭</span>
    </div>

    <div class="login-section">
      <button class="wx-login-btn" @click="handleLogin">
        <span class="btn-text">微信一键登录</span>
      </button>
      <span class="tip-text">登录即表示同意《用户协议》和《隐私政策》</span>
      
      <div class="demo-tip">
        <span>💡 演示模式：点击直接体验</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

async function handleLogin() {
  try {
    const res = await userStore.login('demo_code_001', '测试用户', '')
    if (res.user.role) {
      if (res.user.role === 'mom') {
        router.push('/mom/jobs')
      } else {
        router.push('/company/index')
      }
    } else {
      router.push('/role-select')
    }
  } catch (err) {
    console.error('登录失败:', err)
  }
}
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  min-height: 676px;
  background: linear-gradient(180deg, #FF6B9D 0%, #FF8FAB 50%, #FFE5EC 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 100px 30px 50px;
  box-sizing: border-box;
}

.logo-section {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 20px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(255, 107, 157, 0.3);
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #FF6B9D;
}

.slogan {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
}

.login-section {
  padding: 0 10px;
}

.wx-login-btn {
  width: 100%;
  height: 48px;
  background: #fff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.btn-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.tip-text {
  display: block;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.demo-tip {
  margin-top: 20px;
  text-align: center;
  
  span {
    font-size: 13px;
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 14px;
    border-radius: 14px;
  }
}
</style>
