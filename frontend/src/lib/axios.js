// we are creating an instance of the axios here which we can use all over the app;

import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : import.meta.env.MODE==="development" ? "http://localhost:5000/api" : "/api",
    withCredentials : true, //The withCredentials: true option in Axios is used to indicate whether cross-site requests should include credentials such as cookies, authorization headers, or TLS client certificates. if it is not allowd the response cookie is not set in the browser
})

