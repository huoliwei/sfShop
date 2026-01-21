/**
 * 购物清单 Store 单元测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShoppingListStore } from '../shoppingList'

describe('ShoppingList Store', () => {
  beforeEach(() => {
    // 每个测试前创建新的 pinia 实例
    setActivePinia(createPinia())
  })

  it('初始状态应该为空', () => {
    const store = useShoppingListStore()
    expect(store.items).toEqual([])
    expect(store.totalQuantity).toBe(0)
    expect(store.totalPrice).toBe(0)
    expect(store.isEmpty).toBe(true)
  })

  it('应该能添加商品到清单', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 2,
    })

    expect(store.items.length).toBe(1)
    expect(store.totalQuantity).toBe(2)
    expect(store.totalPrice).toBe(200)
    expect(store.isEmpty).toBe(false)
  })

  it('添加已存在的商品应该增加数量', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 2,
    })

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 3,
    })

    expect(store.items.length).toBe(1)
    expect(store.items[0]?.quantity).toBe(5)
    expect(store.totalQuantity).toBe(5)
  })

  it('应该能删除清单中的商品', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 2,
    })

    const itemId = store.items[0]?.id
    if (itemId) {
      store.removeItem(itemId)
    }

    expect(store.items.length).toBe(0)
    expect(store.isEmpty).toBe(true)
  })

  it('应该能更新商品数量', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 2,
    })

    const itemId = store.items[0]?.id
    if (itemId) {
      store.updateQuantity(itemId, 5)
    }

    expect(store.items[0]?.quantity).toBe(5)
    expect(store.totalQuantity).toBe(5)
    expect(store.totalPrice).toBe(500)
  })

  it('更新数量为0应该删除商品', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 2,
    })

    const itemId = store.items[0]?.id
    if (itemId) {
      store.updateQuantity(itemId, 0)
    }

    expect(store.items.length).toBe(0)
  })

  it('应该能清空清单', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品1',
      productImage: 'test1.jpg',
      price: 100,
      quantity: 2,
    })

    store.addItem({
      productId: 2,
      productName: '测试商品2',
      productImage: 'test2.jpg',
      price: 200,
      quantity: 1,
    })

    store.clearList()

    expect(store.items.length).toBe(0)
    expect(store.isEmpty).toBe(true)
  })

  it('应该能根据ID获取商品', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品',
      productImage: 'test.jpg',
      price: 100,
      quantity: 2,
    })

    const itemId = store.items[0]?.id || ''
    const item = store.getItemById(itemId)

    expect(item).toBeDefined()
    expect(item?.productName).toBe('测试商品')
  })

  it('计算总价应该正确', () => {
    const store = useShoppingListStore()

    store.addItem({
      productId: 1,
      productName: '测试商品1',
      productImage: 'test1.jpg',
      price: 100,
      quantity: 2,
    })

    store.addItem({
      productId: 2,
      productName: '测试商品2',
      productImage: 'test2.jpg',
      price: 50,
      quantity: 3,
    })

    expect(store.totalQuantity).toBe(5)
    expect(store.totalPrice).toBe(350)
  })
})
