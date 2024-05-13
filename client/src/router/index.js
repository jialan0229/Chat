import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  //  hash 模式。
  history: createWebHashHistory(),
  routes: [
    { 
      path: '/',
      // redirect: '/login', 
      component: () => import('@/view/login/index.vue') 
    },
    { 
      path: '/chat', 
      component: () => import('@/view/chat/index.vue') 
    },
  ],
})

export default router

