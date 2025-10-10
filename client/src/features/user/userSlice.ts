import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import isEmail from "validator/lib/isEmail";
import type { RootState } from "app/rootReducer";

export interface UserState {
  username: string;
  userId: string;
  role: string;
}

const initialState: UserState = {
  username: "",
  userId: "",
  role: "",
};

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
    setUserInfo: (state, action: PayloadAction<Partial<UserState>>) => {
      let { username } = action.payload;
      if (username && isEmail(username)) {
        action.payload.username = username.split("@")[0];
      }
      Object.assign(state, action.payload);
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export const userInfo = (state: Pick<RootState, "userInfo">) => state.userInfo;

export default userSlice.reducer;
