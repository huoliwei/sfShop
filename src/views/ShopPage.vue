<template>
  <div class="shop-page">
    <!-- 固定顶部导航 -->
    <van-nav-bar title="商城" fixed placeholder>
      <template #right>
        <van-icon name="search" size="18" color="#000000" @click="goToSearch" />
      </template>
    </van-nav-bar>

    <!-- 分类标签 -->
    <div class="category-tabs" v-if="categories.length > 0">
      <van-tabs v-model:active="activeCategory" @change="onCategoryChange">
        <van-tab
          v-for="category in categories"
          :key="category.id"
          :name="category.id"
          :title="category.name"
        />
      </van-tabs>
    </div>

    <!-- 商品列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="product-list"
      >
        <div class="product-grid">
          <div
            class="product-card"
            v-for="product in products"
            :key="product.id"
            @click="goToProduct(product.id)"
          >
            <van-image
              :src="product.image"
              fit="cover"
              class="product-image"
              lazy-load
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-category">{{ product.categoryName }}</div>
              <div class="product-price-row">
                <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
                <span class="product-original-price" v-if="product.originalPrice">
                  ¥{{ product.originalPrice.toFixed(2) }}
                </span>
              </div>
            </div>
            <van-tag type="danger" v-if="product.discount" class="product-tag">
              {{ product.discount }}% OFF
            </van-tag>
            <van-tag type="primary" v-if="product.isNew" class="product-tag-new">
              NEW
            </van-tag>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 空状态 -->
    <van-empty v-if="!loading && products.length === 0" description="暂无商品" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList } from '@/api/product'
import { getCategoryList } from '@/api/category'
import type { Product, Category } from '@/types'

const router = useRouter()

// 状态
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const activeCategory = ref<string | number>('all')
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = 10

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = [
      { id: 'all', name: '全部', nameEn: 'All', productCount: 0 },
      ...(res.data || []),
    ]
  } catch (error) {
    console.error('加载分类失败：', error)
  }
}

// 加载商品列表
const loadProducts = async () => {
  try {
    loading.value = true

    const params: {
      page: number
      pageSize: number
      categoryId?: string | number
    } = {
      page: page.value,
      pageSize,
    }

    if (activeCategory.value !== 'all') {
      params.categoryId = activeCategory.value
    }

    const res = await getProductList(params)
    const newProducts = res.data?.list || []

    if (refreshing.value) {
      products.value = newProducts
      refreshing.value = false
    } else {
      products.value = [...products.value, ...newProducts]
    }

    finished.value = !res.data?.hasMore
    loading.value = false
  } catch (error) {
    console.error('加载商品失败：', error)
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  page.value = 1
  finished.value = false
  refreshing.value = true
  loadProducts()
}

// 滚动加载
const onLoad = () => {
  if (!refreshing.value) {
    page.value++
    loadProducts()
  }
}

// 切换分类
const onCategoryChange = (categoryId: string | number) => {
  activeCategory.value = categoryId
  page.value = 1
  products.value = []
  finished.value = false
  loadProducts()
}

// 跳转到商品详情
const goToProduct = (id: string | number) => {
  router.push(`/product/${id}`)
}

// 跳转到搜索页
const goToSearch = () => {
  router.push('/search')
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

/* 分类标签 */
.category-tabs {
  background-color: white;
  position: sticky;
  top: 46px; /* NavBar 高度 */
  z-index: 99;
}

.category-tabs :deep(.van-tab--active) {
  color: #000000;
  font-weight: 600;
}

.category-tabs :deep(.van-tabs__line) {
  background-color: #000000;
}

/* 商品列表 */
.product-list {
  padding: 10px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.product-image {
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-text);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 40px;
  margin-bottom: 4px;
}

.product-category {
  font-size: 12px;
  color: var(--color-secondary-text);
  margin-bottom: 8px;
}

.product-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-accent);
}

.product-original-price {
  font-size: 12px;
  color: var(--color-secondary-text);
  text-decoration: line-through;
}

.product-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.product-tag-new {
  position: absolute;
  top: 8px;
  left: 8px;
}
</style>
