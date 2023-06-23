import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "../reducers/rootReducer";

const persisteConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  rootReducers: rootReducer,
});

const persistedReducer = persistReducer(persisteConfig, reducer);
export const store = configureStore({
  reducer: persistedReducer,
});
