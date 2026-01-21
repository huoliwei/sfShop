<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const active = ref(0)

// 根据当前路由设置激活的 tab
const updateActive = () => {
  const path = route.path
  if (path.startsWith('/explore')) {
    active.value = 0
  } else if (path.startsWith('/shop')) {
    active.value = 1
  } else if (path.startsWith('/list')) {
    active.value = 2
  } else if (path.startsWith('/profile')) {
    active.value = 3
  }
}

// 监听路由变化
router.afterEach(() => {
  updateActive()
})

// 初始化
updateActive()

const onChange = (index: number) => {
  const routes = ['/explore', '/shop', '/list', '/profile']
  router.push(routes[index])
}
</script>

<template>
  <van-tabbar v-model="active" @change="onChange" :fixed="true" :placeholder="true">
    <van-tabbar-item icon="fire-o">探索</van-tabbar-item>
    <van-tabbar-item icon="shop-o">商城</van-tabbar-item>
    <van-tabbar-item icon="orders-o">清单</van-tabbar-item>
    <van-tabbar-item icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
/* 未选中状态：浅灰色 */
:deep(.van-tabbar-item) {
  color: #CCCCCC;
}

:deep(.van-tabbar-item .van-icon) {
  color: #CCCCCC;
}

/* 选中状态：深黑色加粗 */
:deep(.van-tabbar-item--active) {
  color: #000000 !important;
  font-weight: 600;
}

:deep(.van-tabbar-item--active .van-icon) {
  color: #000000 !important;
}
</style>
