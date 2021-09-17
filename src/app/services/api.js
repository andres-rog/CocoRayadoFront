import axios from "axios";
const isProduction = process.env.NODE_ENV === "production";

const baseURL = isProduction ? "https://cocorayado.herokuapp.com/api" : "http://localhost:3092/api";

axios.defaults.withCredentials = true

export const _api = axios.create ({
    baseURL,
    timeout:10000
})