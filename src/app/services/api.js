import axios from "axios";
const isProduction = process.env.NODE_ENV === "production";

const baseURL = isProduction ? "www.deploy.com/api" : "http://localhost:3115/api";

axios.defaults.withCredentials = true

export const _api = axios.create ({
    baseURL,
    timeout:10000
})