import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getAllCategories = (params: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/category`, { headers: obj, params: params });
}

export const createNewCategory = (data: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.post(`${API_ENDPOINT}/category`, data, { headers: obj });
}

export const getCategoryDetail = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/category/${id}`, { headers: obj });
}

export const updateCategory = (id: string, data: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.put(`${API_ENDPOINT}/category/${id}`, data, { headers: obj });
}

export const deleteCategory = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.delete(`${API_ENDPOINT}/category/${id}`, { headers: obj });
}
