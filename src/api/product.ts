/**
 * 商品相关 API
 */
import { request } from '@/utils/request'
import type { Product, PaginationParams, PaginationResponse } from '@/types'

// 获取商品列表
export function getProductList(params?: PaginationParams & { categoryId?: string | number }) {
  return request.get<PaginationResponse<Product>>('/products', { params })
}

// 获取商品详情
export function getProductDetail(id: string | number) {
  return request.get<Product>(`/products/${id}`)
}

// 搜索商品
export function searchProducts(keyword: string, params?: PaginationParams) {
  return request.get<PaginationResponse<Product>>('/products/search', {
    params: { keyword, ...params },
  })
}
