/**
 * Mock API 拦截器
 * 使用 axios-mock-adapter 拦截 API 请求并返回 Mock 数据
 */
import MockAdapter from 'axios-mock-adapter'
import type { AxiosInstance } from 'axios'
import { mockCategories, mockProducts, mockPromotions } from './data'
import type { Product } from '@/types'

export function setupMock(axiosInstance: AxiosInstance, options = { delayResponse: 300 }) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: options.delayResponse })

  // 商品详情（必须在商品列表之前，因为路径更具体）
  mock.onGet(/\/api\/products\/\d+$/).reply((config) => {
    const id = config.url?.split('/').pop()
    const product = mockProducts.find((p: Product) => String(p.id) === id)

    if (product) {
      return [
        200,
        {
          code: 200,
          message: '成功',
          data: product,
        },
      ]
    }

    return [
      404,
      {
        code: 404,
        message: '商品不存在',
        data: null,
      },
    ]
  })

  // 搜索商品（必须在商品列表之前，因为路径更具体）
  mock.onGet(/\/api\/products\/search/).reply((config) => {
    const keyword = config.params?.keyword || ''
    const filteredProducts = mockProducts.filter((p: Product) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.nameEn?.toLowerCase().includes(keyword.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(keyword.toLowerCase())
    )

    return [
      200,
      {
        code: 200,
        message: '成功',
        data: {
          list: filteredProducts,
          total: filteredProducts.length,
          page: 1,
          pageSize: 10,
          hasMore: false,
        },
      },
    ]
  })

  // 商品列表（最后匹配，只匹配 /api/products 结尾的路径）
  mock.onGet(/\/api\/products$/).reply((config) => {
    const categoryId = config.params?.categoryId
    let filteredProducts = mockProducts

    // 如果有分类筛选
    if (categoryId && categoryId !== 'all') {
      filteredProducts = mockProducts.filter((p: Product) => p.categoryId === categoryId)
    }

    return [
      200,
      {
        code: 200,
        message: '成功',
        data: {
          list: filteredProducts,
          total: filteredProducts.length,
          page: 1,
          pageSize: 10,
          hasMore: false,
        },
      },
    ]
  })

  // 分类列表
  mock.onGet(/\/api\/categories/).reply(() => {
    return [
      200,
      {
        code: 200,
        message: '成功',
        data: mockCategories,
      },
    ]
  })

  // 促销活动列表
  mock.onGet(/\/api\/promotions/).reply(() => {
    return [
      200,
      {
        code: 200,
        message: '成功',
        data: mockPromotions,
      },
    ]
  })

  console.log('Mock API 已启用')
}
