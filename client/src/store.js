// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer, // postReducer 추가
  },
});

export default store;
