import axios from 'axios';
import { message } from 'ant-design-vue';

import { baseURL } from '@/config';
import { getToken } from './auth';

// 创建一个axios实例
const instance = axios.create({
  baseURL,
  // 设置超时时间
  timeout: 6000,
  // 设置默认的请求头
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// 请求拦截器
instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  
  const token = getToken();
  if(token) {
    config.headers.Authorization = token;
  }

  return config;
});

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 任意响应都会经过这里
    const { code, msg } = response.data;
    if(code == 0) {
      return response.data;
    }else if(code == 500) {
      message.error(msg);
    }else if(code == 401) {
      location.href = '/login';
      return Promise.reject(error);
    } else {
      message.warning(msg);
    }

    return response.data;
  },
  error => {
    // 响应错误处理
    message.error(error);
    return Promise.reject(error);
  }
);

// 导出axios实例
export default instance;