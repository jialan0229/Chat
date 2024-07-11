import { createRouter, createWebHistory } from 'vue-router';

import { getToken } from '@/utils';

const router = createRouter({
  //  history模式。
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      // redirect: '/login', 
      name: 'Login',
      component: () => import('@/view/login/index.vue')
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('@/view/chat/index.vue')
    },
    {
      path: '/call/audio-call',
      component: () => import('@/view/call/audioCall.vue')
    },
    {
      path: '/call/video-call',
      component: () => import('@/view/call/videoCall.vue')
    },
  ],
})

/* router.beforeEach(async (to, from, next) => {
  const isToken = getToken();
  if (to.name !== 'Login' && !isToken) next({ name: 'Login' })
  else next()
}) */

export default router

