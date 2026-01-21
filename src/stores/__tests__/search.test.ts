/**
 * 搜索历史 Store 单元测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '../search'

describe('Search Store', () => {
  beforeEach(() => {
    // 每个测试前创建新的 pinia 实例
    setActivePinia(createPinia())
  })

  it('初始状态应该为空', () => {
    const store = useSearchStore()
    expect(store.history).toEqual([])
  })

  it('应该能添加搜索历史', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针')
    
    expect(store.history.length).toBe(1)
    expect(store.history[0].keyword).toBe('缝纫机针')
    expect(store.history[0].timestamp).toBeDefined()
  })

  it('添加空字符串不应该生效', () => {
    const store = useSearchStore()
    
    store.addHistory('')
    store.addHistory('   ')
    
    expect(store.history.length).toBe(0)
  })

  it('添加重复关键词应该移到最前面', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针')
    store.addHistory('梭芯')
    store.addHistory('缝纫机针') // 重复
    
    expect(store.history.length).toBe(2)
    expect(store.history[0].keyword).toBe('缝纫机针')
    expect(store.history[1].keyword).toBe('梭芯')
  })

  it('搜索历史应该按时间倒序排列', () => {
    const store = useSearchStore()
    
    store.addHistory('第一个')
    store.addHistory('第二个')
    store.addHistory('第三个')
    
    expect(store.history[0].keyword).toBe('第三个')
    expect(store.history[1].keyword).toBe('第二个')
    expect(store.history[2].keyword).toBe('第一个')
  })

  it('搜索历史不应超过最大数量限制', () => {
    const store = useSearchStore()
    const MAX_HISTORY = 10
    
    // 添加超过最大数量的历史记录
    for (let i = 1; i <= 15; i++) {
      store.addHistory(`关键词${i}`)
    }
    
    expect(store.history.length).toBe(MAX_HISTORY)
    expect(store.history[0].keyword).toBe('关键词15') // 最新的
    expect(store.history[9].keyword).toBe('关键词6') // 最旧的保留项
  })

  it('应该能删除指定的搜索历史', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针')
    store.addHistory('梭芯')
    store.addHistory('压脚')
    
    store.removeHistory('梭芯')
    
    expect(store.history.length).toBe(2)
    expect(store.history.find(h => h.keyword === '梭芯')).toBeUndefined()
    expect(store.history[0].keyword).toBe('压脚')
    expect(store.history[1].keyword).toBe('缝纫机针')
  })

  it('删除不存在的关键词不应该报错', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针')
    
    expect(() => {
      store.removeHistory('不存在的关键词')
    }).not.toThrow()
    
    expect(store.history.length).toBe(1)
  })

  it('应该能清空所有搜索历史', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针')
    store.addHistory('梭芯')
    store.addHistory('压脚')
    
    store.clearHistory()
    
    expect(store.history.length).toBe(0)
    expect(store.history).toEqual([])
  })

  it('清空空历史不应该报错', () => {
    const store = useSearchStore()
    
    expect(() => {
      store.clearHistory()
    }).not.toThrow()
    
    expect(store.history.length).toBe(0)
  })

  it('添加关键词应该自动去除首尾空格', () => {
    const store = useSearchStore()
    
    store.addHistory('  缝纫机针  ')
    
    expect(store.history[0].keyword).toBe('缝纫机针')
  })

  it('时间戳应该是合理的数值', () => {
    const store = useSearchStore()
    const beforeTime = Date.now()
    
    store.addHistory('缝纫机针')
    
    const afterTime = Date.now()
    const timestamp = store.history[0].timestamp
    
    expect(timestamp).toBeGreaterThanOrEqual(beforeTime)
    expect(timestamp).toBeLessThanOrEqual(afterTime)
  })

  it('多次添加同一关键词应该更新时间戳', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针')
    const firstTimestamp = store.history[0].timestamp
    
    // 等待一小段时间
    setTimeout(() => {
      store.addHistory('缝纫机针')
      const secondTimestamp = store.history[0].timestamp
      
      expect(secondTimestamp).toBeGreaterThan(firstTimestamp)
      expect(store.history.length).toBe(1)
    }, 10)
  })

  it('应该能正确处理特殊字符', () => {
    const store = useSearchStore()
    
    store.addHistory('缝纫机针 #16')
    store.addHistory('梭芯/梭壳')
    store.addHistory('压脚（万能型）')
    
    expect(store.history.length).toBe(3)
    expect(store.history[0].keyword).toBe('压脚（万能型）')
    expect(store.history[1].keyword).toBe('梭芯/梭壳')
    expect(store.history[2].keyword).toBe('缝纫机针 #16')
  })

  it('应该能正确处理中英文混合关键词', () => {
    const store = useSearchStore()
    
    store.addHistory('Needle 缝纫机针')
    store.addHistory('Bobbin梭芯')
    
    expect(store.history.length).toBe(2)
    expect(store.history[0].keyword).toBe('Bobbin梭芯')
    expect(store.history[1].keyword).toBe('Needle 缝纫机针')
  })
})
