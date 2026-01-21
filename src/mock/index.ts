/**
 * Mock 数据入口文件
 */
import request from '@/utils/request'
import { setupMock } from './handler'

// 根据环境变量决定是否启用 Mock
const enableMock = import.meta.env.VITE_ENABLE_MOCK !== 'false'

if (enableMock) {
  setupMock(request)
}

export { setupMock }
