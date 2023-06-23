import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + "api/v1";

export const getAllTasks = (params: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/task`, { headers: obj, params: params });
};

export const createNewTask = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/task`, data, { headers: obj });
};

export const updateTaskbyId = (id: any, data: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/task/${id}`, data, { headers: obj });
};

export const taskById = (id: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/task/${id}`, { headers: obj });
};

export const deleteTask = (id: string) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.delete(`${API_ENDPOINT}/task/${id}`, { headers: obj });
};
