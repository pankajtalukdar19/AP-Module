import api from "./axios.config";
import type { ApiResponse } from "../types/api.types";

interface InterestSummary {
  principalAmount: number;
  totalInterest: number;
  dailyInterest: number;
  lastCalculated: string;
}

interface InterestDetail {
  vendorId: {
    _id: string;
    name: string;
    email: string;
    businessName: string;
  };
  principalAmount: number;
  interestRate: number;
  dailyInterest: number;
  totalInterest: number;
  month: number;
  year: number;
  lastCalculatedDate: string;
  applications: Array<{
    applicationId: {
      _id: string;
      invoiceNumber: string;
      invoiceAmount: number;
    };
    amount: number;
    date: string;
  }>;
}

export const interestApi = {
  getVendorInterest: async () => {
    return await api.get<ApiResponse<InterestDetail>>(`/interest/vendor`);
  },

  getAllInterest: async () => {
    return await api.get<ApiResponse<InterestDetail[]>>(`/interest/all`);
  },

  getInterestSummary: async () => {
    return await api.get<ApiResponse<InterestSummary>>("/interest/summary");
  },

  getInterestAdminSummary: async () => {
    return await api.get<ApiResponse<any>>(
      "/interest/admin-summary"
    );
  },
};
