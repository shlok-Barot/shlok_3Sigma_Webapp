import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getAllContent = (params: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/content`, { headers: obj, params: params });
}

export const getContentById = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/content/${id}`, { headers: obj});
}

export const deleteContent = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.delete(`${API_ENDPOINT}/content/${id}`, { headers: obj});
}

export const createNewContent = (data: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.post(`${API_ENDPOINT}/content`, data, { headers: obj});
}

export const updateContent = (data: any, id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.put(`${API_ENDPOINT}/content/${id}`, data, { headers: obj });
}
