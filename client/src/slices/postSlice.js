// src/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// 비동기 작업으로 posts 데이터를 가져오는 함수
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await API.get("/posts");
  return response.data;
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postSlice.reducer;
