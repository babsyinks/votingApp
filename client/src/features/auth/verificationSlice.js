import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userJustVerified: false,
};

/**
 * verificationSlice
 *
 * It handles setting the verification status of a user who is registering an account. This
 * should only be set to true when a user's registration has been verified and validated after
 * a fresh registration has been initiated.
 */
const verificationSlice = createSlice({
  name: "verification_status",
  initialState,
  reducers: {
    setUserJustVerified(state, action) {
      state.userJustVerified = action.payload;
    },
    resetUserJustVerified(state) {
      state.userJustVerified = false;
    },
  },
});

export const { setUserJustVerified, resetUserJustVerified } = verificationSlice.actions;

export const selectUserJustVerified = (state) => state.verificationStatus.userJustVerified;

export default verificationSlice.reducer;
