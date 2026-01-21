/**
 * 购物清单 Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShoppingListItem } from '@/types'

export const useShoppingListStore = defineStore(
  'shoppingList',
  () => {
    // 状态
    const items = ref<ShoppingListItem[]>([])

    // 计算属性
    const totalQuantity = computed(() => {
      return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    const totalPrice = computed(() => {
      return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    const isEmpty = computed(() => items.value.length === 0)

    // 方法
    const addItem = (item: Omit<ShoppingListItem, 'id' | 'addedAt'>) => {
      // 检查商品是否已存在
      const existingItem = items.value.find((i) => i.productId === item.productId)

      if (existingItem) {
        // 如果已存在，增加数量
        existingItem.quantity += item.quantity
      } else {
        // 如果不存在，添加新项
        items.value.push({
          ...item,
          id: Date.now(),
          addedAt: Date.now(),
        })
      }
    }

    const removeItem = (itemId: string | number) => {
      const index = items.value.findIndex((item) => item.id === itemId)
      if (index > -1) {
        items.value.splice(index, 1)
      }
    }

    const updateQuantity = (itemId: string | number, quantity: number) => {
      const item = items.value.find((i) => i.id === itemId)
      if (item) {
        if (quantity <= 0) {
          removeItem(itemId)
        } else {
          item.quantity = quantity
        }
      }
    }

    const clearList = () => {
      items.value = []
    }

    const getItemById = (itemId: string | number) => {
      return items.value.find((item) => item.id === itemId)
    }

    return {
      // 状态
      items,
      // 计算属性
      totalQuantity,
      totalPrice,
      isEmpty,
      // 方法
      addItem,
      removeItem,
      updateQuantity,
      clearList,
      getItemById,
    }
  },
  {
    persist: {
      key: 'sf-shop-list',
      storage: localStorage,
    },
  }
)
