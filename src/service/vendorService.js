import axios from "./api";


const getVendorname = async (data) => {
    return axios.get("/vendor");
};

const vendorService = {
    getVendorname
};

export default vendorService;