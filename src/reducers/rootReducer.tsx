import { combineReducers } from "redux";
import activityReducer from "./activityReducer";
import authReducer from "./authReducer";
import leadListReducer from "./leadListReducer";
import leadReducer from "./leadReducer";
import getLogIdReducer from "./logIdReducer";
import taskReducer from "./taskReducer";
import noteReducer from "./noteReducer";
import userReducer from "./userReducer";
import userDetailsReducer from "./userDetailReducer";
import leadTaskReducer from "./leadTaskReducer";
import leadFileList from "./leadFileListReducer";
import customSourceList from "./customSourceList";
import setLeadName from "./leadName";

export const rootReducer = combineReducers({
  auth: authReducer,
  logId: getLogIdReducer,
  leads: leadReducer,
  leadList: leadListReducer,
  activity: activityReducer,
  leadTask: leadTaskReducer,
  note: noteReducer,
  task: taskReducer,
  user: userReducer,
  userData: userDetailsReducer,
  leadFile: leadFileList,
  customSource: customSourceList,
  leadName: setLeadName,
});
