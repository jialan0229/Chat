import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  //  hash 模式。
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/view/home/index.vue')
    },
    {
      path: '/first',
      component: () => import('@/view/first/index.vue')
    },
    { 
      path: '/second', 
      component: () => import('@/view/second/index.vue') 
    },
    { 
      path: '/login', 
      component: () => import('@/view/login/index.vue') 
    },
    { 
      path: '/chat', 
      component: () => import('@/view/chat/index.vue') 
    },
  ],
})

export default router

