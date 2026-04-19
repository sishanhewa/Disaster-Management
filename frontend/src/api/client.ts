import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

// Request Interceptor: add Authorization from memory
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle 401 and refresh token logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try refreshing the token
        const refreshResponse = await axios.post(
          `${apiClient.defaults.baseURL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken; // Assumes backend returns { accessToken: "..." }
        
        // Update token in store
        useAuthStore.getState().setToken(newAccessToken);

        // Update original request auth header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Second 401 (refresh failed), clean up and redirect
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
