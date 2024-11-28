// src/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginRequest,
  registerRequest,
  getStatusRequest,
  getCurrentUserRequest,
} from "../apiRequests";

// 로컬 스토리지에서 토큰을 읽어 초기 상태 설정
const tokenFromStorage = localStorage.getItem("authToken");
const token =
  tokenFromStorage &&
  tokenFromStorage !== "null" &&
  tokenFromStorage !== "undefined"
    ? tokenFromStorage
    : null;

// 로그인 Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const token = await loginRequest(username, password);
      localStorage.setItem("authToken", token);
      return token;
    } catch (error) {
      return rejectWithValue(error.message || "로그인에 실패했습니다.");
    }
  }
);

// 회원가입 Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { username, password, email, quizQuestion, userAnswer },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerRequest({
        username,
        password,
        email,
        quizQuestion,
        userAnswer,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "회원가입에 실패했습니다.");
    }
  }
);

// 현재 사용자 정보 가져오기 Thunk
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUserRequest(); // { id, username, role }
      return user; // 직접 사용자 데이터를 반환
    } catch (error) {
      return rejectWithValue(
        error.message || "현재 사용자 정보를 가져오는데 실패했습니다."
      );
    }
  }
);

// 상태 정보 가져오기 Thunk
export const getStatus = createAsyncThunk(
  "auth/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      const status = await getStatusRequest();
      return status;
    } catch (error) {
      return rejectWithValue(
        error.message || "상태 정보를 가져오는데 실패했습니다."
      );
    }
  }
);

// 초기 상태 정의
const initialState = {
  isLoggedIn: !!token,
  token: token,
  user: null, // { id, username, role }
  error: null,
  loginStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  registerStatus: "idle",
  userStatus: "idle",
  statusState: "idle",
  statusData: null,
};

// auth 슬라이스 생성
const authSlice = createSlice({
  name: "auth",
  initialState,
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
      // 로그인 처리
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload;
        state.error = null;
        state.loginStatus = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || "로그인에 실패했습니다.";
        state.loginStatus = "failed";
      })

      // 회원가입 처리
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.error = null;
        state.registerStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || "회원가입에 실패했습니다.";
        state.registerStatus = "failed";
      })

      // 현재 사용자 정보 가져오기 처리
      .addCase(getCurrentUser.pending, (state) => {
        state.userStatus = "loading";
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload; // { id, username, role }
        state.userStatus = "succeeded";
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error =
          action.payload || "현재 사용자 정보를 가져오는데 실패했습니다.";
        state.userStatus = "failed";
        // 토큰이 유효하지 않을 경우 로그아웃 처리
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem("authToken");
      })

      // 상태 정보 가져오기 처리
      .addCase(getStatus.pending, (state) => {
        state.statusState = "loading";
        state.error = null;
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.statusState = "succeeded";
        state.statusData = action.payload;
      })
      .addCase(getStatus.rejected, (state, action) => {
        state.statusState = "failed";
        state.error = action.payload || "상태 정보를 가져오는데 실패했습니다.";
      });
  },
});

// 셀렉터 정의
export const selectCurrentUserId = (state) => state.auth.user?.id;
export const selectUserRole = (state) => state.auth.user?.role; // role 셀렉터 추가
export const selectStatusData = (state) => state.auth.statusData;
export const selectStatusState = (state) => state.auth.statusState;
export const selectAuthError = (state) => state.auth.error;

// 액션 및 리듀서 내보내기
export const { logout } = authSlice.actions;
export default authSlice.reducer;
