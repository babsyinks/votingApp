import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userInfoReducer from "../features/user/userSlice";
import userAuthReducer from "../features/auth/user/userAuthSlice";
import adminAuthReducer from "../features/auth/admin/adminAuthSlice";
import timerReducer from "../features/timer/timerSlice";
import electionReducer from "../features/election/electionSlice";

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    userInfo: userInfoReducer,
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    timer: timerReducer,
    election: electionReducer,
  },
});
