import api from "./axios.config";
import type { ApiResponse } from "../types/api.types";
import type { User } from "../types/user.types";

interface UpdateProfileRequest {
  name: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  getProfile: async (id: string) => {
    return await api.get<ApiResponse<User>>("/user/" + id);
  },

  updateProfile: async (id: string, data: UpdateProfileRequest) => {
    return await api.put<ApiResponse<User>>("/user/" + id, data);
  },

  changePassword: async (data: ChangePasswordRequest) => {
    return await api.post<ApiResponse<void>>("/user/change-password", data);
  },
};
