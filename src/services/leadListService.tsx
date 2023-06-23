import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getAllLeadList = (params: object) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/lead-list`, { headers: obj, params: params });
}

export const deleteLeadList = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.delete(`${API_ENDPOINT}/lead-list/${id}`, { headers: obj });
}

export const createLeadList = (data: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.post(`${API_ENDPOINT}/lead-list`, data, { headers: obj });
}
