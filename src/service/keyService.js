import axios from "./api";


const key = async (data) => {
    return axios.post("/key", data);
};
const getKey = async () => {
    return axios.get("/key");
};
const getKeyById = async (id, data) => {
    return axios.put("/key/" + id, data);
};

const keyService = {
    key,
    getKey,
    getKeyById
};

export default keyService;