import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userAuthReducer from "features/auth/userAuthSlice";
import verificationReducer from "features/auth/verificationSlice";
import electionReducer from "features/election/electionSlice";
import timerReducer from "features/timer/timerSlice";
import userInfoReducer from "features/user/userSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import loaderReducer from "./loaderSlice";

const rootReducer = combineReducers({
  loader: loaderReducer,
  userInfo: userInfoReducer,
  userAuth: userAuthReducer,
  timer: timerReducer,
  election: electionReducer,
  verificationStatus: verificationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userAuth", "timer", "election", "verificationStatus"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
