import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://95.165.29.71:8080/'
})