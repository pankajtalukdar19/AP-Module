import axios from "./api";


const payment = async (data) => {
    return axios.post("/payment", data);
};
const paymentDataById = async (id) => {
    return axios.get("/payment/"+id);
};

const paymentService = {
    payment,
    paymentDataById
};

export default paymentService;