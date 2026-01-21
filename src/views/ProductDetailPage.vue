<template>
  <div class="product-detail-page">
    <NavBar title="商品详情" />

    <div v-if="loading" class="loading-container">
      <van-loading size="24px">加载中...</van-loading>
    </div>

    <div v-else-if="product" class="product-content">
      <!-- 商品图片 -->
      <van-swipe class="product-swipe" :autoplay="0" indicator-color="white">
        <van-swipe-item
          v-for="(image, index) in (product.images || [product.image])"
          :key="index"
          @click="onImageClick(index)"
        >
          <van-image :src="image" fit="contain" class="product-image" />
        </van-swipe-item>
      </van-swipe>

      <!-- 商品信息 -->
      <div class="product-info-section">
        <div class="product-price-row">
          <span class="product-price">¥{{ product.price?.toFixed(2) }}</span>
          <span class="product-original-price" v-if="product.originalPrice">
            ¥{{ product.originalPrice.toFixed(2) }}
          </span>
          <van-tag type="danger" v-if="product.discount" class="discount-tag">
            {{ product.discount }}% OFF
          </van-tag>
        </div>

        <div class="product-name">{{ product.name }}</div>
        <div class="product-name-en" v-if="product.nameEn">{{ product.nameEn }}</div>

        <div class="product-tags">
          <van-tag type="primary" v-if="product.isNew">新品</van-tag>
          <van-tag type="danger" v-if="product.isHot">热销</van-tag>
          <van-tag plain>{{ product.categoryName }}</van-tag>
          <van-tag plain>库存：{{ product.stock }}</van-tag>
        </div>
      </div>

      <!-- 规格信息 -->
      <div class="product-specs-section" v-if="product.specifications">
        <div class="section-title">规格参数</div>
        <div class="specs-content">{{ product.specifications }}</div>
      </div>

      <!-- 商品描述 -->
      <div class="product-desc-section">
        <div class="section-title">商品描述</div>
        <div class="desc-content">{{ product.description }}</div>
      </div>

      <!-- 底部操作栏 -->
      <div class="action-bar">
        <van-stepper v-model="quantity" min="1" :max="product.stock" />
        <van-button type="primary" size="large" class="add-button" @click="addToList">
          加入清单
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'
import { getProductDetail } from '@/api/product'
import { useShoppingListStore } from '@/stores/shoppingList'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const shoppingListStore = useShoppingListStore()

// 状态
const product = ref<Product | null>(null)
const loading = ref(true)
const quantity = ref(1)
const currentImage = ref(0)

// 加载商品详情
const loadProduct = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const res = await getProductDetail(id)
    product.value = res.data
  } catch (error) {
    console.error('加载商品详情失败：', error)
    showToast('商品不存在')
    router.back()
  } finally {
    loading.value = false
  }
}

// 加入清单
const addToList = () => {
  if (!product.value) return

  shoppingListStore.addItem({
    productId: product.value.id,
    productName: product.value.name,
    productImage: product.value.image,
    price: product.value.price,
    quantity: quantity.value,
    specifications: product.value.specifications,
  })

  showToast({
    message: '已加入清单',
    icon: 'success',
  })
}

// 图片预览
const onImageClick = (index: number) => {
  if (!product.value?.images) return

  currentImage.value = index
  // Vant ImagePreview 会自动处理
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.product-content {
  background-color: white;
}

/* 商品图片 */
.product-swipe {
  height: 375px;
  background-color: #f5f5f5;
}

.product-image {
  width: 100%;
  height: 375px;
}

/* 商品信息 */
.product-info-section {
  padding: 10px;
  border-bottom: 8px solid #f7f8fa;
}

.product-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.product-price {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-accent);
}

.product-original-price {
  font-size: 14px;
  color: var(--color-secondary-text);
  text-decoration: line-through;
}

.discount-tag {
  margin-left: auto;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-text);
  line-height: 1.5;
  margin-bottom: 4px;
}

.product-name-en {
  font-size: 14px;
  color: var(--color-secondary-text);
  margin-bottom: 12px;
}

.product-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 规格信息 */
.product-specs-section {
  padding: 10px;
  border-bottom: 8px solid #f7f8fa;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-text);
  margin-bottom: 12px;
}

.specs-content {
  font-size: 14px;
  color: var(--color-secondary-text);
  line-height: 1.6;
}

/* 商品描述 */
.product-desc-section {
  padding: 10px;
}

.desc-content {
  font-size: 14px;
  color: var(--color-primary-text);
  line-height: 1.8;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.add-button {
  flex: 1;
}
</style>
