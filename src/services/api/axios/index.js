import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api" //process.env.REACT_APP_BACKEND_HOST,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.accept = "application/vnd.api+json"

    const authToken = Cookies.get("auth-token");

    if (authToken) {
      config.headers.authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
