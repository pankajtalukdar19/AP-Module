import api from "@api/axios.config";
export const applicationsApi = {
  getApplications: async () => {
    const response = await api.get("/applications");
    return response.data;
  },
};
