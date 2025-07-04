import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import userInfoReducer from "features/user/userSlice";
import userAuthReducer from "features/auth/userAuthSlice";
import timerReducer from "features/timer/timerSlice";
import electionReducer from "features/election/electionSlice";
import verificationReducer from "features/auth/verificationSlice";

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
  whitelist: ["userAuth", "timer", "election", "justVerified"],
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
