import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://101.35.128.180:3000/api', // 后端 API 的基础 URL
  withCredentials: true, // 如果需要跨域请求，确保携带 cookie
});

export default axiosInstance;
