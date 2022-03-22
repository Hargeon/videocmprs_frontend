import axios from "../axios";

const endpoints = {
  registration: (data) => axios.post("/v1/users", data),
  login: (data) => axios.post("/v1/auth/sign-in", data),
  getProfile: () => axios.get("/v1/auth/me"),
  tgAccount: () => axios.get("/v1/tg_accounts"),
  tgLink: () => axios.get("/v1/tg_accounts/link")
};

export default endpoints;
