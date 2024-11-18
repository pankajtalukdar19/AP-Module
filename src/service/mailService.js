import axios from "./api";

// Add Product
const sendMail = async (payload) => {
  return axios.post("/mail", payload);
};
const getApplications = async () => {
  return axios.get("/mail");
};
const updateApplication = (id, status) => {
  return axios.put("/mail/" + id, status);
};
const getDataById = (id) => {
  return axios.get("/mail/" + id);
};
const applicationReject = (data) => {
  return axios.post("/mail/reject", data);
};
const getallDataByID = (data) => {
  console.log('data', data);
  
  return axios.get("/mail/by-vendor/"+ data? data : data._id);
  // return axios.get("/mail/by-vendor/"+ data._id);
};
const mailservice = {
  sendMail,
  updateApplication,
  getDataById,
  applicationReject,
  getApplications,
  getallDataByID
};

export default mailservice;
