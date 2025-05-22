import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  adminIsAuthenticated: false,
};

const login = createAsyncThunk("admin/login", async () => {
  const {
    data: { authenticated },
  } = await axios.get(
    // "https://votingapp-pmev.onrender.com/auth/admin/login",
    "/auth/admin/login",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": localStorage.getItem("token"),
      },
    },
  );
  if (!authenticated) throw new Error("authentication failed");
  return authenticated;
});

/**
 * adminAuthSlice
 *
 * It handles admin authentication granting access to admin only accessable parts of the app for
 * example setting timers, adding election contestants, setting election schedule and terminating same.
 */
export const adminAuthSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.adminIsAuthenticated = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.adminIsAuthenticated = false;
      });
  },
});

export { login };

export const adminAuth = (state) => state.adminAuth.adminIsAuthenticated;

export default adminAuthSlice.reducer;
