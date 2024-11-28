import api from "./axios.config";
import type { ApiResponse } from "../types/api.types";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
  status: "active" | "inactive" | "suspended";
}

interface CreateVendorRequest {
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
}

export const vendorsApi = {
  getVendors: async () => {
    return await api.get<ApiResponse<Vendor[]>>("/user");
  },

  createVendor: async (data: CreateVendorRequest) => {
    return await api.post<ApiResponse<Vendor>>("/user", data);
  },

  updateVendor: async (id: string, data: Partial<CreateVendorRequest>) => {
    return await api.put<ApiResponse<Vendor>>(`/user/${id}`, data);
  },

  deleteVendor: async (id: string) => {
    return await api.delete<ApiResponse<void>>(`/user/${id}`);
  },
};
