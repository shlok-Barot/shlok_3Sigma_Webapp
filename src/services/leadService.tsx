import axios from "axios";
import { API_URL } from "../config/config";
import { CreateLeadDataI } from "../views/leads/createLeadForm";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + "api/v1";

export const getAllLeads = (params: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/lead`, { headers: obj, params: params });
};

export const createNewLead = (data: CreateLeadDataI) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/lead`, data, { headers: obj });
};

export const createNewLeadByCsv = (data: FormData) => {
  let obj = {
    "Content-Type": "multipart/form-data",
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/lead/csv`, data, { headers: obj });
};

export const deleteLead = (id: string) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.delete(`${API_ENDPOINT}/lead/${id}`, { headers: obj });
};

export const downloadCsvFile = (id: string) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/lead/csv-template/${id}`, { headers: obj });
};

export const updateLeadStatus = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/lead/status`, data, { headers: obj });
};

export const updateLeadLabel = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/lead/label`, data, { headers: obj });
};

export const getLeadDetail = (id: string) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/lead/${id}`, { headers: obj });
};

export const updateLead = (id: string, data: CreateLeadDataI) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/lead/${id}`, data, { headers: obj });
};

export const copyLeadToLeadList = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/lead`, data, { headers: obj });
};

export const moveLeadToLeadList = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/lead`, data, { headers: obj });
};

export const filterLeads = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/lead/filter`, data, { headers: obj });
};
export const addCSV = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.post(`${API_ENDPOINT}/lead/csv`, data, { headers: obj });
};

export const putUserPreferences = (data: any) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.put(`${API_ENDPOINT}/user/preference`, data, {
    headers: obj,
  });
};
