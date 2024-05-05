import axios from 'axios';
import { message } from 'ant-design-vue';

const baseURL = 'http://127.0.0.1:9000/';
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
  // config.headers.Authorization = 'Bearer '; // 假设你需要在每个请求上附加一个令牌
  return config;
});

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 任意响应都会经过这里
    const { code } = response.data;
    if(code == 0) {
      message.success(response.data.message);
    }else {
      message.warning(response.data.message);
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