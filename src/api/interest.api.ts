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
  getVendorInterest: async (month: number, year: number) => {
    return await api.get<ApiResponse<InterestDetail>>(
      `/interest/vendor?month=${month}&year=${year}`
    );
  },

  getAllInterest: async (month: number, year: number) => {
    return await api.get<ApiResponse<InterestDetail[]>>(
      `/interest/all?month=${month}&year=${year}`
    );
  },

  getInterestSummary: async () => {
    return await api.get<ApiResponse<InterestSummary>>("/interest/summary");
  },
};
