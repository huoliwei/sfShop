/**
 * 分类相关 API
 */
import { request } from '@/utils/request'
import type { Category } from '@/types'

// 获取分类列表
export function getCategoryList() {
  return request.get<Category[]>('/categories')
}

// 获取分类详情
export function getCategoryDetail(id: string | number) {
  return request.get<Category>(`/categories/${id}`)
}
