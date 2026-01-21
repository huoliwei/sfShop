/**
 * 缝纫机零件商城 - TypeScript 类型定义
 */

// 商品接口
export interface Product {
  id: string | number
  name: string
  nameEn?: string
  categoryId: string | number
  categoryName: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  description: string
  specifications?: string
  stock: number
  isNew?: boolean
  isHot?: boolean
  discount?: number
}

// 分类接口
export interface Category {
  id: string | number
  name: string
  nameEn?: string
  icon?: string
  parentId?: string | number
  children?: Category[]
  productCount?: number
}

// 购物清单项接口
export interface ShoppingListItem {
  id: string | number
  productId: string | number
  productName: string
  productImage: string
  price: number
  quantity: number
  specifications?: string
  addedAt: number
}

// 购物清单接口
export interface ShoppingList {
  items: ShoppingListItem[]
  totalQuantity: number
  totalPrice: number
}

// API 响应接口
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 分页参数接口
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应接口
export interface PaginationResponse<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 搜索历史接口
export interface SearchHistory {
  keyword: string
  timestamp: number
}

// 促销活动接口
export interface Promotion {
  id: string | number
  title: string
  subtitle?: string
  image: string
  link?: string
  startTime?: number
  endTime?: number
}
