import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getAllQuotations = (params: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }

    const res= axios.get(`${API_ENDPOINT}/quotation`, { headers: obj, params: params });
    return res;
}

export const createQuotations = (data: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }

    const res= axios.post(`${API_ENDPOINT}/quotation`,data, { headers: obj});
    return res;
}

export const updateQuotations = (data: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }

    const res= axios.put(`${API_ENDPOINT}/quotation`,data, { headers: obj});
    return res;
}

export const deleteQuotations = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }

    const res= axios.delete(`${API_ENDPOINT}/quotation/${id}`, { headers: obj});
    return res;
}

export const getQuotationDetails = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }

    return axios.get(`${API_ENDPOINT}/quotation/${id}`, { headers: obj });
}
