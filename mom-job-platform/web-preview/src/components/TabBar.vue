<template>
  <div class="tabbar">
    <div class="tab-item" :class="{ active: current === 'jobs' }" @click="$emit('change', 'jobs')">
      <span class="tab-icon">💼</span>
      <span class="tab-text">找工作</span>
    </div>
    <div class="tab-item" :class="{ active: current === 'applications' }" @click="$emit('change', 'applications')">
      <span class="tab-icon">📋</span>
      <span class="tab-text">申请</span>
    </div>
    <div class="tab-item" :class="{ active: current === 'profile' }" @click="$emit('change', 'profile')">
      <span class="tab-icon">👤</span>
      <span class="tab-text">我的</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: {
    type: String,
    default: 'jobs'
  }
})
defineEmits(['change'])
</script>

<style scoped lang="scss">
.tabbar {
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  display: flex;
  border-top: 1px solid #eee;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  
  &.active {
    .tab-text {
      color: #FF6B9D;
    }
  }
}

.tab-icon {
  font-size: 22px;
}

.tab-text {
  font-size: 11px;
  color: #999;
}
</style>
