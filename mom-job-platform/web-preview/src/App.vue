<template>
  <div class="app-wrapper">
    <div class="phone-frame">
      <div class="status-bar">
        <span class="time">9:41</span>
        <span class="status-icons">
          <span>📶</span>
          <span>🔋</span>
        </span>
      </div>
      <div class="page-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.app-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 0;
}

.phone-frame {
  width: 375px;
  min-height: 720px;
  background: #f8f8f8;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  position: relative;
  border: 10px solid #1a1a1a;
}

.status-bar {
  height: 44px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 100;
}

.status-icons {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.page-container {
  height: calc(720px - 44px);
  overflow-y: auto;
  position: relative;
}
</style>
