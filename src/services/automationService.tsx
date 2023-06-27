import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + "api/v1";

export const getAutomationList = () => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/automate`, {
    headers: obj,
  });
};

export const getAllIntegration = (params: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/integration`, {
    headers: obj,
    params: params,
  });
};

export const deleteAutomation = (id: string) => {
  let obj = {
      ...getHeaderOptions,
      Authorization: localStorage.getItem('auth_token') || ''
  }
  return axios.delete(`${API_ENDPOINT}/automate/${id}`, { headers: obj});
}

export const getFilePageContent = (params: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/content`, {
    headers: obj,
    params: params,
  });
};

export const getLeadList = (params: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/lead-list`, {
    headers: obj,
    params: params,
  });
};

export const getUserOrganizationList = (params: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/organization`, {
    headers: obj,
    params: params,
  });
};

export const createAutomation = (data: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/automate`, data, { headers: obj });
};

export const updateAutomation = (id: string, data: object) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/automate/${id}`, data, { headers: obj });
};