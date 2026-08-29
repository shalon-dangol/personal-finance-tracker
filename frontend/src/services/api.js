import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

let refreshPromise = null;

API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/login') && !original.url.includes('/refresh')) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = API.post('/users/refresh').then((res) => {
            setAccessToken(res.data.accessToken);
            return res.data.accessToken;
          }).finally(() => {
            refreshPromise = null;
          });
        }
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return API(original);
      } catch (refreshError) {
        setAccessToken(null);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default API;