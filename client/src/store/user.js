import { defineStore } from "pinia";

import { _login, _register } from '@/server/auth.js'
import { setToken } from '@/utils';

export const useUsersStore = defineStore('users', {
  state: () => ({
    isLoginPage: false,
    userInfo: {},
  }),
  actions: {
    async login(info, router) {
      const resolve = await _login(info);

      if(resolve.code == 0) {
        this.userInfo = resolve.data;
        setToken(resolve.data.token);
        router.push('/chat')
      }
    },
    async register(loginState) {
      const resolve = await _register(loginState);
      if(resolve.code == 0) {
        this.isLoginPage = !this.isLoginPage
      }
    }
  }
})