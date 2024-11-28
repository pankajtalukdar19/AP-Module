import api from "./axios.config";
import type {
  LoginRequest,
  AuthResponse,
  RefreshTokenResponse,
} from "../types/auth.types";
import type { ApiResponse } from "../types/api.types";

export const authApi = {
  login: async (data: LoginRequest) => {
    return await api.post<ApiResponse<AuthResponse>>("auth/login", data);
  },

  refreshToken: async (refreshToken: string) => {
    return await api.post<ApiResponse<RefreshTokenResponse>>("auth/refresh", {
      refreshToken,
    });
  },

  forgotPassword: async (email: string) => {
    return await api.post<ApiResponse<void>>("/user/forgot-password", {
      email,
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return await api.post<ApiResponse<void>>("/user/reset-password", {
      token,
      newPassword,
    });
  },
};
