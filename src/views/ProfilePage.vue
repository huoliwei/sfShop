<template>
  <div class="profile-page">
    <!-- 固定顶部导航 -->
    <van-nav-bar title="我的" fixed placeholder />

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <van-image
        round
        width="60"
        height="60"
        src="https://via.placeholder.com/120x120/000000/FFFFFF?text=User"
        class="user-avatar"
      />
      <div class="user-info">
        <div class="user-name">访客用户</div>
        <div class="user-desc">欢迎来到缝纫机零件商城</div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell
          v-for="item in menuItems"
          :key="item.title"
          :title="item.title"
          :value="item.value"
          :icon="item.icon"
          is-link
          @click="onMenuClick(item.link)"
        />
      </van-cell-group>
    </div>

    <!-- 设置列表 -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell
          v-for="item in settingItems"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          is-link
          @click="onMenuClick(item.link)"
        />
      </van-cell-group>
    </div>

    <!-- 版本信息 -->
    <div class="version-info">
      <div class="version-text">缝纫机零件商城 v1.0.0</div>
      <div class="copyright">© 2026 All Rights Reserved</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useShoppingListStore } from '@/stores/shoppingList'
import { useSearchStore } from '@/stores/search'

const router = useRouter()
const shoppingListStore = useShoppingListStore()
const searchStore = useSearchStore()

// 菜单项
const menuItems = [
  {
    icon: 'orders-o',
    title: '购物清单',
    value: `${shoppingListStore.totalQuantity} 件`,
    link: '/list',
  },
  {
    icon: 'clock-o',
    title: '搜索历史',
    value: `${searchStore.history.length} 条`,
    link: '/search',
  },
]

const settingItems = [
  {
    icon: 'info-o',
    title: '关于我们',
    link: '',
  },
  {
    icon: 'phone-o',
    title: '联系客服',
    link: '',
  },
]

const onMenuClick = (link: string) => {
  if (link) {
    router.push(link)
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

/* 用户信息卡片 */
.user-card {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  padding: 32px 16px;
  display: flex;
  align-items: center;
  color: white;
}

.user-avatar {
  flex-shrink: 0;
}

.user-info {
  margin-left: 16px;
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-desc {
  font-size: 14px;
  opacity: 0.8;
}

/* 菜单列表 */
.menu-section {
  margin-top: 12px;
  padding: 0 10px;
}

/* 版本信息 */
.version-info {
  text-align: center;
  padding: 32px 16px;
  color: var(--color-secondary-text);
}

.version-text {
  font-size: 12px;
  margin-bottom: 4px;
}

.copyright {
  font-size: 12px;
}
</style>
