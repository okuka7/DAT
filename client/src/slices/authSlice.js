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
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const token = await loginRequest(username, password); // 토큰 반환
      const user = await getCurrentUserRequest(); // 로그인 후 사용자 정보 요청
      return { token, user }; // user 객체에 id와 username 포함
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to login");
    }
  }
);

// 비동기 회원가입 액션
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerRequest(userData); // 회원가입 요청 함수
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to register");
    }
  }
);

// 비동기 로그인 사용자 정보 액션
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserRequest(); // 사용자 정보 요청
      const { id, username } = response.data; // response에서 id와 username 추출
      return { id, username }; // { id, username } 형태로 반환
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch current user"
      );
    }
  }
);

// 비동기 상태 조회 액션
export const getStatus = createAsyncThunk(
  "auth/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await getStatusRequest(); // 상태 조회 요청 함수
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch status");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    user: { id: null, username: null }, // user 초기값을 명확하게 설정
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
      state.user = { id: null, username: null };
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
        console.log("loginUser fulfilled action.payload:", action.payload); // 디버깅용
        state.isLoggedIn = true;
        state.token = action.payload.token; // loginRequest에서 받은 토큰
        state.user = action.payload.user; // user 객체에 id와 username 설정
        state.error = null;
        state.loginStatus = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
        state.registerStatus = "failed";
      })

      // 사용자 정보 조회 상태
      .addCase(getCurrentUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log("getCurrentUser fulfilled action.payload:", action.payload); // 디버깅용
        state.isLoggedIn = true;
        state.user = action.payload; // 사용자 정보 업데이트
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

// 현재 로그인한 사용자의 ID를 가져오는 셀렉터
export const selectCurrentUserId = (state) => state.auth.user?.id;

// 상태 데이터와 상태 상태를 선택하는 셀렉터
export const selectStatusData = (state) => state.auth.statusData;
export const selectStatusState = (state) => state.auth.statusState;
export const selectAuthError = (state) => state.auth.error;

export const { logout } = authSlice.actions;
export default authSlice.reducer;
