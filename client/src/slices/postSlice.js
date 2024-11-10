import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 최신 게시물 데이터를 가져오는 비동기 액션
export const getLatestPosts = createAsyncThunk(
  "posts/getLatestPosts",
  async () => {
    const response = await axios.get("http://localhost:8080/api/posts/latest");
    return response.data;
  }
);

// 모든 게시물 데이터를 가져오는 비동기 액션
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("http://localhost:8080/api/posts");
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    latestPosts: [],
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // 최신 게시물 가져오기
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
      })
      // 모든 게시물 가져오기
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// 특정 게시물 찾기 셀렉터
export const selectPostById = (state, postId) =>
  state.posts.items.find((post) => post.id === postId);

export const selectAllPosts = (state) => state.posts.items;

export default postsSlice.reducer;
