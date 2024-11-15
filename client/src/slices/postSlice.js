// src/slices/postSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 최신 게시물 데이터를 가져오는 비동기 액션
export const getLatestPosts = createAsyncThunk(
  "posts/getLatestPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/posts/latest"
      );
      return response.data.posts; // 컨트롤러에서 { posts: [...] } 형태로 반환
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch latest posts"
      );
    }
  }
);

// 모든 게시물 데이터를 가져오는 비동기 액션
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts");
      return response.data.posts; // 컨트롤러에서 { posts: [...] } 형태로 반환
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);

// 특정 게시물 데이터를 가져오는 비동기 액션
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      console.log("Token:", token); // 토큰 확인 로그

      // headers 객체에서 토큰이 없으면 Authorization 헤더를 생략
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `http://localhost:8080/api/posts/${postId}`,
        { headers }
      );

      return response.data; // 컨트롤러에서 PostDTO 형태로 반환
    } catch (error) {
      console.error("Error details:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch post");
    }
  }
);

// 게시물 삭제 비동기 액션
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token; // Redux 상태에서 토큰 가져오기
      if (!token) throw new Error("User is not authenticated");

      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete post");
    }
  }
);

// 게시물 업데이트 비동기 액션
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.put(
        `http://localhost:8080/api/posts/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // 업데이트된 게시물 데이터 반환
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update the post"
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    latestPosts: [],
    items: [],
    status: "idle",
    postStatus: "idle", // 특정 게시물 상태 관리
    error: null,
  },
  reducers: {},
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
      })

      // 특정 게시물 가져오기
      .addCase(fetchPostById.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.postStatus = "succeeded";
        const post = action.payload;
        if (!state.items.some((p) => p.id === post.id)) {
          state.items.push(post);
        } else {
          // 기존 게시물이 있다면 업데이트
          const index = state.items.findIndex((p) => p.id === post.id);
          if (index !== -1) {
            state.items[index] = post;
          }
        }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.postStatus = "failed";
        state.error = action.payload || action.error.message;
      })

      // 게시물 삭제
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // 게시물 업데이트
      .addCase(updatePost.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postStatus = "succeeded";
        const updatedPost = action.payload;
        const existingPost = state.items.find(
          (post) => post.id === updatedPost.id
        );
        if (existingPost) {
          Object.assign(existingPost, updatedPost);
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.postStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

// 특정 게시물 찾기 셀렉터
export const selectPostById = (state, postId) => {
  return state.posts.items.find((post) => post.id === postId) || null;
};

// 모든 게시물 셀렉터
export const selectAllPosts = (state) => state.posts.items;

// 최신 게시물 셀렉터
export const selectLatestPosts = (state) => state.posts.latestPosts;
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;

export default postsSlice.reducer;
