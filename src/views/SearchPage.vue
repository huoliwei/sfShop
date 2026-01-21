<template>
  <div class="search-page">
    <!-- 固定顶部导航 -->
    <NavBar title="搜索" fixed placeholder />

    <!-- 固定搜索框 -->
    <div class="search-bar">
      <van-search
        v-model="keyword"
        placeholder="搜索缝纫机零件"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 搜索历史 -->
      <div class="search-history" v-if="!keyword && searchStore.history.length > 0">
      <div class="history-header">
        <div class="history-title">搜索历史</div>
        <van-icon name="delete-o" @click="onClearHistory" />
      </div>
      <div class="history-list">
        <van-tag
          v-for="item in searchStore.history"
          :key="item.keyword"
          size="large"
          class="history-tag"
          closeable
          @click="onHistoryClick(item.keyword)"
          @close="onDeleteHistory(item.keyword)"
        >
          {{ item.keyword }}
        </van-tag>
      </div>
    </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-if="keyword && !searching">
        <div class="results-header">
          找到 {{ products.length }} 个结果
        </div>
        <div class="product-list" v-if="products.length > 0">
          <div
            class="product-item"
            v-for="product in products"
            :key="product.id"
            @click="goToProduct(product.id)"
          >
            <van-image
              :src="product.image"
              fit="cover"
              class="product-image"
              lazy-load
            />
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-category">{{ product.categoryName }}</div>
              <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <van-empty v-else description="未找到相关商品" />
      </div>

      <!-- 加载状态 -->
      <van-loading v-if="searching" class="loading-center" size="24px">搜索中...</van-loading>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/Layout/NavBar.vue'
import { useSearchStore } from '@/stores/search'
import { searchProducts } from '@/api/product'
import type { Product } from '@/types'

const router = useRouter()
const searchStore = useSearchStore()

// 状态
const keyword = ref('')
const products = ref<Product[]>([])
const searching = ref(false)

// 搜索
const onSearch = async () => {
  if (!keyword.value.trim()) return

  try {
    searching.value = true
    searchStore.addHistory(keyword.value)
    
    const res = await searchProducts(keyword.value)
    products.value = res.data?.list || []
  } catch (error) {
    console.error('搜索失败：', error)
  } finally {
    searching.value = false
  }
}

// 点击历史记录
const onHistoryClick = (historyKeyword: string) => {
  keyword.value = historyKeyword
  onSearch()
}

// 删除历史记录
const onDeleteHistory = (historyKeyword: string) => {
  searchStore.removeHistory(historyKeyword)
}

// 清空历史记录
const onClearHistory = () => {
  searchStore.clearHistory()
}

// 跳转到商品详情
const goToProduct = (id: string | number) => {
  router.push(`/product/${id}`)
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: var(--van-tabbar-height);
}

/* 固定搜索框 */
.search-bar {
  position: fixed;
  top: 46px; /* NavBar 高度 */
  left: 0;
  right: 0;
  background-color: white;
  z-index: 99;
}

/* 内容区域 */
.content-wrapper {
  padding-top: 100px; /* NavBar(46px) + SearchBar(54px) */
}

/* 搜索历史 */
.search-history {
  padding: 10px;
  background-color: white;
  margin-bottom: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-text);
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
}

/* 搜索结果 */
.search-results {
  padding: 10px;
}

.results-header {
  font-size: 14px;
  color: var(--color-secondary-text);
  margin-bottom: 12px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: #f5f5f5;
}

.product-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-text);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-category {
  font-size: 12px;
  color: var(--color-secondary-text);
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-accent);
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
