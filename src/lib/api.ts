import axios from 'axios';

const api = axios.create({
  baseURL: 'https://clinic-backend-06kv.onrender.com', // Your backend URL
});

// This "interceptor" runs before any request is sent
api.interceptors.request.use(
  (config) => {
    // It gets the token from the browser's local storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If a token exists, it adds it to the request's Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;