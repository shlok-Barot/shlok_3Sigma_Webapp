import {
  SET_ACTIVITIES,
  SET_LEADS,
  SET_LEADS_LIST,
  SET_LOGID,
  SET_NOTES,
  SET_PREFERENCES,
  SET_SELECTED_LEAD,
  SET_TASKS,
  SET_USER_DETAILS,
  SET_LEADTASK,
  SET_LEADFILELIST,
  SET_CUSTOMSOURCE,
  SET_LEADNAME
} from "./actionTypes";

// logId
export const setLogId = (status: string) => {
  return {
    type: SET_LOGID,
    payload: status,
  };
};

// leads action
export const setLeads = (leads: any) => {
  return {
    type: SET_LEADS,
    payload: leads,
  };
};

// lead-list action
export const setLeadList = (list: any) => {
  return {
    type: SET_LEADS_LIST,
    payload: list,
  };
};

export const selectedLeadList = (leadList: any) => {
  return {
    type: SET_SELECTED_LEAD,
    payload: leadList,
  };
};

// user action
export const userPreferences = (preferences: any) => {
  return {
    type: SET_PREFERENCES,
    payload: preferences,
  };
};

// user data action
export const setUserDetails = (userdata: any) => {
  return {
    type: SET_USER_DETAILS,
    payload: userdata,
  };
};

// lead detail file upload list
export const leadFileList = (userdata: any) => {
  return {
    type: SET_LEADFILELIST,
    payload: userdata,
  };
};

// activity action
export const setActivityList = (activity: any) => {
  return {
    type: SET_ACTIVITIES,
    payload: activity,
  };
};
// activity action
export const setLeadTaskList = (activity: any) => {
  return {
    type: SET_LEADTASK,
    payload: activity,
  };
};

// notes action
export const setNote = (note: any) => {
  return {
    type: SET_NOTES,
    payload: note,
  };
};

// task action
export const setTask = (task: any) => {
  return {
    type: SET_TASKS,
    payload: task,
  };
};

// costum source
export const setCustomSource = (customSource: any) => {
  return {
    type: SET_CUSTOMSOURCE,
    payload: customSource,
  };
};

// costum source
export const setLeadName = (name: any) => {
  return {
    type: SET_LEADNAME,
    payload: name,
  };
};