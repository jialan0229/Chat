import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import './style/index.less';
import App from '@/App.vue';

createApp(App).use(router).use(Antd).mount('#app')
