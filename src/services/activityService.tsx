import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + "api/v1";

export const getAllActivity = (params: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/activity`, {
    headers: obj,
    params: params,
  });
};

export const createActivity = (data: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/activity`, data, { headers: obj });
};

export const activityById = (id: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/activity/${id}`, { headers: obj });
};

export const updateActivitybyId = (id: any, data: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/activity/${id}`, data, { headers: obj });
};
