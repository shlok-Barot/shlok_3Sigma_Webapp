import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getUserPreferences = () => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/user/preference`, { headers: obj });
}
