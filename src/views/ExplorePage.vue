<template>
  <div class="explore-page">
    <!-- 固定顶部导航 -->
    <van-nav-bar title="探索" fixed placeholder>
      <template #right>
        <van-icon name="search" size="18" color="#000000" @click="router.push('/search')" />
      </template>
    </van-nav-bar>

    <!-- 轮播图 -->
    <van-swipe class="promotion-swipe" :autoplay="3000" indicator-color="white" v-if="promotions.length > 0">
      <van-swipe-item v-for="item in promotions" :key="item.id" @click="goToPromotion(item.link)">
        <div class="promotion-item" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="promotion-content">
            <div class="promotion-title">{{ item.title }}</div>
            <div class="promotion-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>

    <!-- 新品推荐 -->
    <div class="section" v-if="newProducts.length > 0">
      <div class="section-header">
        <div class="section-title">新品推荐</div>
        <div class="section-more" @click="router.push('/shop')">查看更多 ></div>
      </div>
      <div class="product-scroll">
        <div
          class="product-card-small"
          v-for="product in newProducts"
          :key="product.id"
          @click="goToProduct(product.id)"
        >
          <van-image
            :src="product.image"
            fit="cover"
            class="product-image"
            lazy-load
          />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
          <van-tag type="danger" v-if="product.discount" class="product-tag">{{ product.discount }}% OFF</van-tag>
        </div>
      </div>
    </div>

    <!-- 热销商品 -->
    <div class="section" v-if="hotProducts.length > 0">
      <div class="section-header">
        <div class="section-title">热销商品</div>
        <div class="section-more" @click="router.push('/shop')">查看更多 ></div>
      </div>
      <div class="product-grid">
        <div
          class="product-card"
          v-for="product in hotProducts"
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
            <div class="product-price-row">
              <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
              <span class="product-original-price" v-if="product.originalPrice">
                ¥{{ product.originalPrice.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-center" size="24px">加载中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPromotionList } from '@/api/promotion'
import { getProductList } from '@/api/product'
import type { Promotion, Product } from '@/types'

const router = useRouter()

// 状态
const promotions = ref<Promotion[]>([])
const newProducts = ref<Product[]>([])
const hotProducts = ref<Product[]>([])
const loading = ref(true)

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 获取促销活动
    const promotionRes = await getPromotionList()
    promotions.value = promotionRes.data || []

    // 获取商品列表
    const productRes = await getProductList({ page: 1, pageSize: 20 })
    const products = productRes.data?.list || []

    // 筛选新品和热销商品
    newProducts.value = products.filter((p) => p.isNew).slice(0, 6)
    hotProducts.value = products.filter((p) => p.isHot).slice(0, 6)
  } catch (error) {
    console.error('加载数据失败：', error)
  } finally {
    loading.value = false
  }
}

// 跳转到商品详情
const goToProduct = (id: string | number) => {
  router.push(`/product/${id}`)
}

// 跳转到促销活动
const goToPromotion = (link?: string) => {
  if (link) {
    router.push(link)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.explore-page {
  min-height: 100vh;
  background-color: var(--color-primary-bg);
  padding-bottom: 60px;
}

/* 轮播图 */
.promotion-swipe {
  height: 200px;
  background-color: #f5f5f5;
}

.promotion-item {
  height: 200px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 24px;
  cursor: pointer;
}

.promotion-content {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.promotion-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.promotion-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

/* 区块 */
.section {
  padding: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-text);
}

.section-more {
  font-size: 14px;
  color: var(--color-secondary-text);
  cursor: pointer;
}

/* 横向滚动商品 */
.product-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.product-scroll::-webkit-scrollbar {
  display: none;
}

.product-card-small {
  flex-shrink: 0;
  width: 140px;
  cursor: pointer;
  position: relative;
}

.product-card-small .product-image {
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.product-card-small .product-name {
  font-size: 14px;
  color: var(--color-primary-text);
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card-small .product-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-text);
  margin-top: 4px;
}

.product-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* 网格商品 */
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
  border: 1px solid var(--color-border);
}

.product-card .product-image {
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
}

.product-info {
  padding: 12px;
}

.product-info .product-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.product-info .product-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-accent);
}

.product-original-price {
  font-size: 12px;
  color: var(--color-secondary-text);
  text-decoration: line-through;
}

/* 加载状态 */
.loading-center {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
