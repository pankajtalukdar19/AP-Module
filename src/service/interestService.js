import axios from "./api";


const getDataByDate = async (data) => {
    return axios.get(`/interest?${data.startDate ? `startDate=${data.startDate}&` : ''}${data.endDate ? `endDate=${data.endDate}&` : ''}${data.vendorId ? `vendorId=${data.vendorId}` : ''}${data.application ? `applicationId=${data.application}` : ''}`);
};

const interestService = {
    getDataByDate
};

export default interestService;