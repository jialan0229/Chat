import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      // 主进程入口文件
      entry: './electron/main.js'
    })
  ],
  // 配置别名
  resolve: {
    alias: {
      '@': path.join(__dirname, "src"),
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/style/variable.less')}";`,
      },
    },
  },
  /*开发服务器选项*/
  server: {
    // 端口
    // port: 3000,
  }
})
