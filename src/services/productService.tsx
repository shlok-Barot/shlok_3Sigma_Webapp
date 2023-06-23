import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getAllProducts = (params: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/product`, { headers: obj, params: params });
}

export const getProductDetails = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/product/${id}`, { headers: obj });
}

export const createNewProduct = (data: { productId: string; name: string; description: string; price: string; category: string; currency: string; }) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.post(`${API_ENDPOINT}/product`, data, { headers: obj, params: obj });
}

export const updateProduct = (data: { description: string; price: string; currency: string; }, id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.put(`${API_ENDPOINT}/product/${id}`, data, { headers: obj, params: obj });
}

export const deleteProduct = (id: string) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.delete(`${API_ENDPOINT}/product/${id}`, { headers: obj, params: obj });
}
