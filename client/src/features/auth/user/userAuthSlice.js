import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userIsAuthenticated: false,
  userIsAdmin: false,
};

/**
 * userAuthSlice
 *
 * It handles setting the authentication status of users, indicating if they are logged in or not
 */
const userAuthSlice = createSlice({
  name: "user_auth",
  initialState,
  reducers: {
    userAuthenticated(state, payload) {
      state.userIsAuthenticated = true;
      setUserAdminStatus(state, payload);
    },
    userNotAuthenticated(state) {
      state.userIsAuthenticated = false;
      state.userIsAdmin = false;
    },
  },
});

const setUserAdminStatus = (state, payload) => {
  console.log('payload', payload)
  if (payload.role === "admin") {
    state.userIsAdmin = true;
  } else {
    state.userIsAdmin = false;
  }
};

export const { userAuthenticated, userNotAuthenticated } =
  userAuthSlice.actions;

export const userAuth = (state) => state.userAuth.userIsAuthenticated;
export const userIsAdmin = (state) => state.user.userIsAdmin;

export default userAuthSlice.reducer;
