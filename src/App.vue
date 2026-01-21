<script setup lang="ts">
import { RouterView } from 'vue-router'
import TabBar from '@/components/Layout/TabBar.vue'
</script>

<template>
  <div class="app-container">
    <RouterView />
    <TabBar />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: var(--color-primary-bg);
  padding: 0;
  margin: 0;
}

.app-container {
  min-height: 100vh;
  background-color: var(--color-primary-bg);
  padding: 0;
  margin: 0;
}
</style>
