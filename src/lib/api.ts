import axios from 'axios';
import store from '@/store/store';
import { setAccessToken, setRefreshToken, logout } from '@/features/userSlice';


// Create an Axios instance
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required to send cookies with each request
});

// Request interceptor: Attach access token to headers
api.interceptors.request.use(
  (config) => {
    const token = store.getState().user.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token expiration and automatic refresh
api.interceptors.response.use(
  (response) => response, // Return response directly if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 (Unauthorized) and it’s not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retries

      try {

        const refreshToken = store.getState().user.refreshToken
        // Attempt to refresh the access token using the refresh token
        const refreshResponse = await axios.post(
          `${baseURL}/api/v1/users/refresh-access-token`,
          {refreshToken},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.data.accessToken
        const newRefreshToken = refreshResponse.data.data.refreshToken

        // Update Redux store with new access token
        store.dispatch(setAccessToken(newAccessToken));
        store.dispatch(setRefreshToken(newRefreshToken));

        // Set the new token in the Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, dispatch logout and reject the request
        store.dispatch(logout());
        window.location.href = '/user/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Reject if another error occurs
  }
);

export default api;
