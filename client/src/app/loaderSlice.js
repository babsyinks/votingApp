import { createSlice, isPending, isRejected, isFulfilled } from '@reduxjs/toolkit';

/**
 * createSlice
 * 
 * It handles the loading state for async operations across the application
 *  - loading state of true is dispatched when the promise of the async operation is pending
 *  - loading state of false is dispatched when the promise is fulfileld or rejected
 */
const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.loading = true;
      })
      .addMatcher((action) => isFulfilled(action) || isRejected(action), (state) => {
        state.loading = false;
      });
  },
});

export const selectLoadingState = (state) => state.loader.loading;

export default loaderSlice.reducer;
