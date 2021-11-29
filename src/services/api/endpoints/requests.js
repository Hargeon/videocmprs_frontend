import axios from "../axios";

const endpoints = {
    create: (data) => axios.post("/v1/requests", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getList: (page) => axios.get(`/v1/requests?page[number]=${page}&page[size]=10`)
}

export default endpoints