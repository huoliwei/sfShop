import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/explore',
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/views/ExplorePage.vue'),
      meta: {
        title: '探索',
      },
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ShopPage.vue'),
      meta: {
        title: '商城',
      },
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/ShoppingListPage.vue'),
      meta: {
        title: '购物清单',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: {
        title: '个人主页',
      },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchPage.vue'),
      meta: {
        title: '搜索',
      },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductDetailPage.vue'),
      meta: {
        title: '商品详情',
      },
    },
  ],
})

export default router
