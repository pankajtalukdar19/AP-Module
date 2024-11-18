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

const authService = {
  signup,
  login,
  userUpdate
};

export default authService;
