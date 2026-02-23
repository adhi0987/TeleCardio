import axios from 'axios';

// Create a central Axios instance pointing to your FastAPI backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Interceptor: Automatically attach the JWT token to every request if the user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 