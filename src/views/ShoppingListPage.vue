<template>
  <div class="shopping-list-page">
    <!-- 固定顶部导航 -->
    <van-nav-bar title="购物清单" fixed placeholder>
      <template #right>
        <van-button
          size="small"
          plain
          type="danger"
          @click="onClearList"
          v-if="!shoppingListStore.isEmpty"
        >
          清空
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 清单列表 -->
    <div class="list-content" v-if="!shoppingListStore.isEmpty">
      <van-swipe-cell
        v-for="item in shoppingListStore.items"
        :key="item.id"
        class="list-item"
      >
        <div class="item-content" @click="goToProduct(item.productId)">
          <van-image
            :src="item.productImage"
            fit="cover"
            class="item-image"
            lazy-load
          />
          <div class="item-info">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-specs" v-if="item.specifications">
              {{ item.specifications }}
            </div>
            <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
          </div>
        </div>
        <div class="item-actions">
          <van-stepper
            :model-value="item.quantity"
            min="1"
            @change="(value: number) => onQuantityChange(item.id, value)"
          />
        </div>
        <template #right>
          <van-button
            square
            type="danger"
            text="删除"
            class="delete-button"
            @click="onDelete(item.id)"
          />
        </template>
      </van-swipe-cell>
    </div>

    <!-- 空状态 -->
    <van-empty v-else description="清单为空">
      <van-button type="primary" @click="goToShop">去逛逛</van-button>
    </van-empty>

    <!-- 底部统计栏 -->
    <div class="list-footer" v-if="!shoppingListStore.isEmpty">
      <div class="footer-info">
        <div class="footer-label">共 {{ shoppingListStore.totalQuantity }} 件商品</div>
        <div class="footer-total">
          合计：<span class="total-price">¥{{ formattedTotalPrice }}</span>
        </div>
      </div>
      <van-button type="primary" size="large" class="send-button" @click="onSendEmail">
        发送清单
      </van-button>
    </div>

    <!-- 邮件发送对话框 -->
    <van-dialog
      v-model:show="showEmailDialog"
      title="发送清单"
      show-cancel-button
      @confirm="onConfirmSend"
    >
      <div class="email-dialog-content">
        <van-field
          v-model="emailAddress"
          label="收件人"
          placeholder="请输入邮箱地址"
          type="email"
          clearable
        />
        <div class="email-tip">
          清单将以邮件形式发送到指定邮箱
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showDialog, showToast, showLoadingToast, closeToast } from 'vant'
import { useShoppingListStore } from '@/stores/shoppingList'

const router = useRouter()
const shoppingListStore = useShoppingListStore()

// 邮件相关
const showEmailDialog = ref(false)
const emailAddress = ref('')

// 计算属性
const formattedTotalPrice = computed(() => {
  return shoppingListStore.totalPrice.toFixed(2)
})

// 更新数量
const onQuantityChange = (itemId: string | number, quantity: number) => {
  shoppingListStore.updateQuantity(itemId, quantity)
}

// 删除商品
const onDelete = async (itemId: string | number) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要从清单中删除该商品吗？',
    })
    shoppingListStore.removeItem(itemId)
  } catch {
    // 用户取消
  }
}

// 清空清单
const onClearList = async () => {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '确定要清空整个清单吗？',
    })
    shoppingListStore.clearList()
  } catch {
    // 用户取消
  }
}

// 跳转到商品详情
const goToProduct = (productId: string | number) => {
  router.push(`/product/${productId}`)
}

// 跳转到商城
const goToShop = () => {
  router.push('/shop')
}

// 发送清单邮件
const onSendEmail = () => {
  showEmailDialog.value = true
}

// 确认发送邮件
const onConfirmSend = async () => {
  if (!emailAddress.value.trim()) {
    showToast('请输入邮箱地址')
    return
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailAddress.value)) {
    showToast('请输入有效的邮箱地址')
    return
  }

  // 模拟发送邮件
  showLoadingToast({
    message: '发送中...',
    forbidClick: true,
    duration: 0,
  })

  // 生成清单内容
  const listContent = generateListContent()

  // 模拟网络请求延迟
  setTimeout(() => {
    closeToast()
    showEmailDialog.value = false
    emailAddress.value = ''

    showDialog({
      title: '发送成功',
      message: `清单已发送至 ${emailAddress.value}\n\n清单内容：\n${listContent}`,
      confirmButtonText: '确定',
    })
  }, 1500)
}

// 生成清单内容
const generateListContent = () => {
  const items = shoppingListStore.items.map((item, index) => {
    return `${index + 1}. ${item.productName} x${item.quantity} - ¥${(item.price * item.quantity).toFixed(2)}`
  }).join('\n')

  return `
商品清单
────────────────
${items}
────────────────
共 ${shoppingListStore.totalQuantity} 件商品
合计：¥${formattedTotalPrice.value}
  `.trim()
}
</script>

<style scoped>
.shopping-list-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

/* 清单列表 */
.list-content {
  padding: 10px;
}

.list-item {
  background-color: white;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.item-content {
  display: flex;
  padding: 12px;
  cursor: pointer;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: #f5f5f5;
}

.item-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-text);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-specs {
  font-size: 12px;
  color: var(--color-secondary-text);
  margin-top: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-accent);
}

.item-actions {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.delete-button {
  height: 100%;
}

/* 底部统计栏 */
.list-footer {
  position: fixed;
  bottom: 56px;
  left: 0;
  right: 0;
  background-color: white;
  padding: 12px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.footer-label {
  font-size: 14px;
  color: var(--color-secondary-text);
}

.footer-total {
  font-size: 14px;
  color: var(--color-primary-text);
}

.total-price {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-accent);
  margin-left: 4px;
}

.send-button {
  width: 100%;
}

/* 邮件对话框 */
.email-dialog-content {
  padding: 16px;
}

.email-tip {
  font-size: 12px;
  color: var(--color-secondary-text);
  margin-top: 12px;
  text-align: center;
}
</style>
