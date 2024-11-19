import { axiosDefault as axios } from "./api";

// Register user
const signup = (userData) => {
  return axios.post("/signup", userData);
};

// Login user
const login = (userData) => {
  return axios.post("/login", userData);
};
// Update user
const userUpdate = (userData) => {
  return axios.patch("/userupdate", userData);
};
const getUser = () => {
  return axios.get("/user");
};

const authService = {
  signup,
  login,
  userUpdate,
  getUser
};

export default authService;
