import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userIsAuthenticated: false,
  userIsAdmin: false,
};

/**
 * userAuthSlice
 *
 * It handles setting the authentication status of users, indicating if they are logged in or not.
 * Additionally, if the user role is 'admin' it grants access to admin only accessable parts of the 
 * app, for example, setting timers, adding election contestants, setting election schedule and 
 * terminating same.
 */
const userAuthSlice = createSlice({
  name: "user_auth",
  initialState,
  reducers: {
    userAuthenticated(state, action) {
      state.userIsAuthenticated = true;
      state.userIsAdmin = action.payload.role === "admin";
    },
    userNotAuthenticated(state) {
      state.userIsAuthenticated = false;
      state.userIsAdmin = false;
    },
  },
});

export const { userAuthenticated, userNotAuthenticated } =
  userAuthSlice.actions;

export const userAuth = (state) => state.userAuth.userIsAuthenticated;
export const userIsAdmin = (state) => state.userAuth.userIsAdmin;

export default userAuthSlice.reducer;
