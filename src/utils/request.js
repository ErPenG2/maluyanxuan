import axios from "axios";
import { getToken,removeToken  } from './auth';
import router from '@/router';
import { showNotify } from 'vant';
import { useUserStore } from '@/store/user';
import {resetLogin}from './userCache'
const request = axios.create({
  // 服务器基本地址
  // baseURL: "http://8.218.112.99",
  baseURL: "/api/ml/ml-mall",
  // 超时处理
  timeout: 5000,
});

//添加请求拦截器
request.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer '.concat(getToken());
  return config;
}, error => Promise.reject(error))

// 添加响应拦截器
request.interceptors.response.use(response => {
//   console.log("---response:", response);
  const data = response.data;
  if (data.code !== 1) {
      if (data.code === 0) {
          // 去调用其它接口，如果没有登录，就没有token
          // 服务器返回code是0，需要去登录，去/login
          // 如果你本来要去的页面就是/login  
          if (router.currentRoute.value.path !== '/login') {
              router.push('/login');
          }
      }
      if (data.code === 3) {
          // 通知
          showNotify({
              type: 'danger',
              message: '用户名或密码错误',
              duration: 1500,
          });
      } else {
          // 过期或未登录
          if (data.message === '请登录') {
              const userStore = useUserStore();
              // 过期或未登录重置用户仓库数据
              userStore.reset();
              // 重置本地数据
              resetLogin();
              // 删除token
              removeToken();
          }
          // 通知
          showNotify({
              type: 'danger',
              message: data.message || '系统繁忙',
              duration: 1500,
          });
      }
      return Promise.reject(data);
  }
  return response.data;
}, error => Promise.reject(error))

export default request