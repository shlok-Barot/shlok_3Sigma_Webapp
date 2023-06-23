import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + 'api/v1';

export const getAllFollowUps = (params: any) => {
    let obj = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem('auth_token') || ''
    }
    return axios.get(`${API_ENDPOINT}/task`, { headers: obj, params: params });
}
export const taskById = (id: any) => {
    let obj = {
      ...getHeaderOptions,
      Authorization: localStorage.getItem("auth_token") || "",
    };
    return axios.get(`${API_ENDPOINT}/task/${id}`, { headers: obj });
  };