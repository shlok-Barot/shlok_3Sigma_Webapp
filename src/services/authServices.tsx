import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const generateOtp = (data: object) => {
    return axios.post(`${API_ENDPOINT}/auth/generate-otp`, data, { headers: getHeaderOptions() });
}
export const signIn = (data: object) => {
    return axios.post(`${API_ENDPOINT}/auth`, data, { headers: getHeaderOptions() });
}

// export const updateProfile = (data: object) => {
//     let obj = {
//         ...getHeaderOptions,
//         Authorization: localStorage.getItem('auth_token') || ''
//     }
//     return axios.put(`${API_ENDPOINT}/user/profile`, data, { headers: obj });
// }