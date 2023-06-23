import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const uploadFiles = (formData: FormData) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.post(`${API_ENDPOINT}/utility/file-upload`, formData, { headers: obj });
}
