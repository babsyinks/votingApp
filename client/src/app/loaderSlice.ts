import {
  createSlice,
  isPending,
  isRejected,
  isFulfilled,
  Action,
} from "@reduxjs/toolkit";

import type { RootState } from "./rootReducer";

/**
 * It handles the loading state for async operations across the application
 *  - loading state of true is dispatched when the promise of the async operation is pending
 *  - loading state of false is dispatched when the promise is fulfilled or rejected
 */
export interface LoaderState {
  loading: boolean;
}

const initialState: LoaderState = {
  loading: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.loading = true;
      })
      .addMatcher(
        (action: Action) => isFulfilled(action) || isRejected(action),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export const selectLoadingState = (state: Pick<RootState, "loader">): boolean =>
  state.loader.loading;

export default loaderSlice.reducer;
