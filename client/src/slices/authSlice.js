// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginRequest,
  registerRequest,
  getStatusRequest,
  getCurrentUserRequest,
} from "../apiRequests";

// 비동기 로그인 액션
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }) => {
    return await loginRequest(username, password); // loginRequest에서 토큰을 반환받음
  }
);

// 비동기 회원가입 액션
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    return await registerRequest(userData); // 회원가입 요청 함수
  }
);

// 비동기 로그인 사용자 정보 액션
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    return await getCurrentUserRequest(); // 현재 사용자 정보 요청 함수
  }
);

// 비동기 상태 조회 액션
export const getStatus = createAsyncThunk("auth/getStatus", async () => {
  return await getStatusRequest(); // 상태 조회 요청 함수
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    user: null,
    error: null,
    loginStatus: "idle", // 로그인 상태
    registerStatus: "idle", // 회원가입 상태
    userStatus: "idle", // 사용자 정보 조회 상태
    statusState: "idle", // 상태 조회를 위한 필드
    statusData: null, // 상태 조회 데이터 저장
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      state.loginStatus = "idle";
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인 상태
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload; // loginRequest에서 받은 토큰
        state.user = action.meta.arg.username; // 로그인 요청에 사용한 사용자 이름 설정
        state.error = null;
        state.loginStatus = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loginStatus = "failed";
      })

      // 회원가입 상태
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.error = null;
        state.registerStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.registerStatus = "failed";
      })

      // 사용자 정보 조회 상태
      .addCase(getCurrentUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload; // 사용자 정보
        state.userStatus = "succeeded";
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.userStatus = "failed";
      })

      // 상태 조회 (getStatus) 설정
      .addCase(getStatus.pending, (state) => {
        state.statusState = "loading";
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.statusState = "succeeded";
        state.statusData = action.payload; // 서버에서 받은 상태 데이터
      })
      .addCase(getStatus.rejected, (state, action) => {
        state.statusState = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;