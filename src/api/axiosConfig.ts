import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.qxjurnal.uz/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout for large file uploads
  maxContentLength: 100 * 1024 * 1024, // 100MB max content length
  maxBodyLength: 100 * 1024 * 1024, // 100MB max body length
});

// Debug: baseURL ni console ga chiqarish
console.log('API Base URL configured:', 'https://api.qxjurnal.uz/api/');

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Debug: URL ni console ga chiqarish
    console.log('API Request URL:', config.baseURL + config.url);
    
    // Use sessionStorage for per-session authentication
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;