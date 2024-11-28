import api from "@api/axios.config";
import type { ApiResponse } from "../types/api.types";

interface Application {
  _id: string;
  vendorId: {
    name: string;
    email: string;
    businessName: string;
  };
  invoiceAmount: number;
  calculatedInvoiceAmount: number;
  invoiceDate: string;
  paymentDate: string;
  dueDate: string;
  invoiceNumber: string;
  paymentCondition: string;
  status: "pending" | "approved" | "rejected";
}

export const applicationsApi = {
  getApplications: async () => {
    const response = await api.get<ApiResponse<Application[]>>("/applications");
    return response.data;
  },

  getApplicationsByVendorId: async (vendorId: string) => {
    const response = await api.get<ApiResponse<Application[]>>(
      `/applications/by-vendor/${vendorId}`
    );
    return response.data;
  },

  updateApplicationStatus: async (
    id: string,
    status: Application["status"]
  ) => {
    const response = await api.put<ApiResponse<Application>>(
      `/applications/${id}/status`,
      { status }
    );
    return response.data;
  },
  submitApplications: async () => {
    const response = await api.post("/applications");
    return response.data;
  },
};
