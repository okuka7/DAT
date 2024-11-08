// src/slices/teamSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// 팀 정보를 비동기로 가져오는 thunk 생성
export const fetchTeamInfo = createAsyncThunk(
  "team/fetchTeamInfo",
  async () => {
    const response = await API.get("/team");
    return response.data;
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teamInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.teamInfo = action.payload;
      })
      .addCase(fetchTeamInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default teamSlice.reducer;
