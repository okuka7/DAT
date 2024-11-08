import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 로그인 액션
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }) => {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });
    if (response.data.success) {
      localStorage.setItem("authToken", response.data.data); // 토큰 저장
      return { token: response.data.data, username };
    } else {
      throw new Error("로그인 실패");
    }
  }
);

// 비동기 회원가입 액션
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    const response = await axios.post(
      "http://localhost:8080/api/users/register",
      userData
    );
    if (!response.data.success) {
      throw new Error("회원가입 실패");
    }
    return response.data;
  }
);

// 비동기 로그인 사용자 정보 액션
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const response = await axios.get(
        "http://localhost:8080/api/users/getLoginUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // 사용자의 데이터 구조에 따라 수정
    } else {
      throw new Error("토큰 없음");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    user: null,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.username;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload; // action.payload 구조 확인
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
