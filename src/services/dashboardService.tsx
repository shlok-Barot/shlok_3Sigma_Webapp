import axios from "axios";
import { API_URL } from "../config/config";
import { getHeaderOptions } from "./getHeaderOptions";

const API_ENDPOINT = API_URL + "api/v1";

export const fetchTeamList = () => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/team`, { headers: obj });
};

export const fetchOrganizationList = () => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  return axios.get(`${API_ENDPOINT}/organization`, { headers: obj });
};

export const fetchDashboardLeadCount = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/lead-count?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardAllActivityCount = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/all-activities-count?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardSalesCount = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/sales-value-count?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardGraphData = (
  fromDate: string,
  toDate: string,
  type: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/graph-data?fromDate=${fromDate}&toDate=${toDate}&dataType=${type}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardLeadLableGraphData = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/label-count?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardLeadSourceGraphData = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/integration-count?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardFunnelChart = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/status-count?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};

export const fetchDashboardMapcheckIn = (
  fromDate: string,
  toDate: string,
  organization: boolean,
  userId: string,
  selectedTeamId: string
) => {
  let obj = {
    ...getHeaderOptions,
    Authorization: localStorage.getItem("auth_token") || "",
  };
  let finelUrl =
    organization && userId
      ? `&isOrganization=${organization}&userId=${userId}`
      : userId && selectedTeamId
      ? `&userId=${userId}&teams=${selectedTeamId}`
      : organization
      ? `&isOrganization=${organization}`
      : userId
      ? `&userId=${userId}`
      : selectedTeamId
      ? `&teams=${selectedTeamId}`
      : "";
  return axios.get(
    `${API_ENDPOINT}/dashboard/check-in?fromDate=${fromDate}&toDate=${toDate}${finelUrl}`,
    { headers: obj }
  );
};
