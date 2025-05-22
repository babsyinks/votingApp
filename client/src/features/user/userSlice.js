import { createSlice } from "@reduxjs/toolkit";

const initialState = { username: "", userId: "", role: "" };

/**
 * userSlice
 *
 * It handles the setting of user information when successfully logged in. This includes the id,
 * username, and role of the user.
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export const userInfo = (state) => state.userInfo;

export default userSlice.reducer;
