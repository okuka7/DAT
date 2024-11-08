import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 최신글 데이터를 가져오는 비동기 액션
export const getLatestPosts = createAsyncThunk(
  "posts/getLatestPosts",
  async () => {
    const response = await axios.get("http://localhost:8080/api/posts/latest");
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    latestPosts: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatestPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLatestPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.latestPosts = action.payload;
      })
      .addCase(getLatestPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
