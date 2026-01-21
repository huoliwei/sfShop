/**
 * 促销活动相关 API
 */
import { request } from '@/utils/request'
import type { Promotion } from '@/types'

// 获取促销活动列表
export function getPromotionList() {
  return request.get<Promotion[]>('/promotions')
}
