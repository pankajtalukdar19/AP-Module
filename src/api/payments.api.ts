import api from "./axios.config";
import type { ApiResponse } from "../types/api.types";

export interface Payment {
  _id: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    businessName: string;
  };
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: "pending" | "completed" | "failed";
  paymentMethod: "bank_transfer" | "cash" | "cheque";
  referenceNumber: string;
  description?: string;
  invoiceNumber: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  paymentDate: string;
  dueDate: string;
  paymentMethod: "bank_transfer" | "cash" | "cheque";
  description?: string;
}

export const paymentsApi = {
  createPayment: async (data: CreatePaymentRequest) => {
    return await api.post<ApiResponse<Payment>>("/payments", data);
  },

  getAllPayments: async () => {
    return await api.get<ApiResponse<Payment[]>>("/payments");
  },

  getVendorPayments: async () => {
    return await api.get<ApiResponse<Payment[]>>("/payments/vendor");
  },

  updatePaymentStatus: async (id: string, status: Payment["status"]) => {
    return await api.put<ApiResponse<Payment>>(`/payments/${id}/status`, {
      status,
    });
  },
};
