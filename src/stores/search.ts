/**
 * 搜索历史 Store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SearchHistory } from '@/types'

export const useSearchStore = defineStore(
  'search',
  () => {
    // 状态
    const history = ref<SearchHistory[]>([])
    const MAX_HISTORY_ITEMS = 10 // 最大历史记录数量

    // 方法
    const addHistory = (keyword: string) => {
      const trimmedKeyword = keyword.trim()
      if (!trimmedKeyword) return

      // 移除已存在的相同关键词
      const index = history.value.findIndex((item) => item.keyword === trimmedKeyword)
      if (index > -1) {
        history.value.splice(index, 1)
      }

      // 添加到开头
      history.value.unshift({
        keyword: trimmedKeyword,
        timestamp: Date.now(),
      })

      // 限制历史记录数量
      if (history.value.length > MAX_HISTORY_ITEMS) {
        history.value = history.value.slice(0, MAX_HISTORY_ITEMS)
      }
    }

    const removeHistory = (keyword: string) => {
      const index = history.value.findIndex((item) => item.keyword === keyword)
      if (index > -1) {
        history.value.splice(index, 1)
      }
    }

    const clearHistory = () => {
      history.value = []
    }

    return {
      // 状态
      history,
      // 方法
      addHistory,
      removeHistory,
      clearHistory,
    }
  },
  {
    persist: {
      key: 'sf-shop-search',
      storage: localStorage,
    },
  }
)
