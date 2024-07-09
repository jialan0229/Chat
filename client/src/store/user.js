import { defineStore } from "pinia";
import { message } from 'ant-design-vue';

import { _login, _register } from '@/server/auth.js'
import { setToken, setUserInfo } from '@/utils';

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
        setUserInfo(resolve.data)
        router.push('/chat')
      } else {
        message.info(resolve.msg)
      }
    },
    async register(loginState) {
      const resolve = await _register(loginState);
      if(resolve.code == 0) {
        this.isLoginPage = !this.isLoginPage
      } else {
        message.info(resolve.msg)
      }
    }
  }
})