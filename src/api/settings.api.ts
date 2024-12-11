import api from "./axios.config";
import type { ApiResponse } from "../types/api.types";

interface Settings {
  interestRate: number;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;
}

export const settingsApi = {
  getSettings: async () => {
    return await api.get<ApiResponse<Settings>>("/settings");
  },

  updateSettings: async (data: Partial<Settings>) => {
    return await api.put<ApiResponse<Settings>>("/settings", data);
  },
};
