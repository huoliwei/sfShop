/**
 * Axios 请求封装
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { showToast } from 'vant'
import type { ApiResponse } from '@/types'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 根据业务状态码判断
    if (res.code !== 200 && res.code !== 0) {
      showToast({
        message: res.message || '请求失败',
        position: 'top',
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    // 返回 data，这样调用方可以直接使用 res.data
    // 使用类型断言绕过 Axios 拦截器的类型限制
    return res as unknown as AxiosResponse<ApiResponse>
  },
  (error) => {
    console.error('响应错误：', error)

    // 处理不同的错误状态码
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          showToast({
            message: '未授权，请重新登录',
            position: 'top',
          })
          // 可以在这里跳转到登录页
          break
        case 403:
          showToast({
            message: '拒绝访问',
            position: 'top',
          })
          break
        case 404:
          showToast({
            message: '请求资源不存在',
            position: 'top',
          })
          break
        case 500:
          showToast({
            message: '服务器错误',
            position: 'top',
          })
          break
        default:
          showToast({
            message: error.response.data?.message || '请求失败',
            position: 'top',
          })
      }
    } else if (error.request) {
      showToast({
        message: '网络错误，请检查网络连接',
        position: 'top',
      })
    } else {
      showToast({
        message: error.message || '请求失败',
        position: 'top',
      })
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.get(url, config)
  },

  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.post(url, data, config)
  },

  put<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.put(url, data, config)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.delete(url, config)
  },
}

export default service
