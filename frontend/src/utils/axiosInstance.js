import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9999/api",
});

export default axiosInstance;