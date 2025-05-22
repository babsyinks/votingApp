import { createSlice } from "@reduxjs/toolkit";

const initialState = { userIsAuthenticated: false };

/**
 * userAuthSlice
 *
 * It handles setting the authentication status of users, indicating if they are logged in or not
 */
const userAuthSlice = createSlice({
  name: "user_auth",
  initialState,
  reducers: {
    userAuthenticated(state) {
      state.userIsAuthenticated = true;
    },
    userNotAuthenticated(state) {
      state.userIsAuthenticated = false;
    },
  },
});

export const { userAuthenticated, userNotAuthenticated } = userAuthSlice.actions;

export const userAuth = (state) => state.userAuth.userIsAuthenticated;

export default userAuthSlice.reducer;
