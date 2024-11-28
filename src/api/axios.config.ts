import axios from "axios";
import { config } from "../config";
import {
  clearAuth,
  selectAccessToken,
  selectRefreshToken,
  setRefreshToken,
  setToken,
} from "@/features/auth/authSlice";
import { store } from "@/store";
import { authApi } from "./auth.api";

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = selectAccessToken(store.getState());
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = selectRefreshToken(store.getState());

        if (refreshToken) {
          const response: any = await authApi.refreshToken(refreshToken || "");

          store.dispatch(setToken(response?.data?.data?.accessToken));
          store.dispatch(setRefreshToken(response?.data?.refreshToken || ""));

          originalRequest.headers.Authorization = `Bearer ${response?.data?.data?.accessToken}`;
          return api(originalRequest);
        } else {
          store.dispatch(clearAuth());
          window.location.href = "/login";
        }
      } catch (refreshError) {
        store.dispatch(clearAuth());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
