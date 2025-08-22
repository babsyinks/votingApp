import { configureStore } from '@reduxjs/toolkit';
import loaderReducer, { selectLoadingState } from '../loaderSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Mock async thunks for testing
const mockAsyncThunk = createAsyncThunk('test/asyncThunk', async () => {
  return 'success';
});

const mockFailingThunk = createAsyncThunk('test/failingThunk', async () => {
  throw new Error('Failed');
});

describe('loaderSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        loader: loaderReducer,
      },
    });
  });

  it('should have initial state with loading false', () => {
    const state = store.getState();
    expect(selectLoadingState(state)).toBe(false);
  });

  it('should set loading to true when an async action is pending', async () => {
    // Dispatch the thunk itself, not the pending action directly
    const promise = store.dispatch(mockAsyncThunk());
    const state = store.getState();
    expect(selectLoadingState(state)).toBe(true);
    // Wait for the thunk to complete to avoid unresolved promises
    await promise;
  });

  it('should set loading to false when an async action is fulfilled', async () => {
    await store.dispatch(mockAsyncThunk());
    const state = store.getState();
    expect(selectLoadingState(state)).toBe(false);
  });

  it('should set loading to false when an async action is rejected', async () => {
    await store.dispatch(mockFailingThunk());
    const state = store.getState();
    expect(selectLoadingState(state)).toBe(false);
  });

  it('should transition from loading true to false when async action completes', async () => {
    // Dispatch the thunk
    const promise = store.dispatch(mockAsyncThunk());
    // Check loading state immediately after dispatch (pending)
    let state = store.getState();
    expect(selectLoadingState(state)).toBe(true);

    // Wait for the thunk to complete (fulfilled)
    await promise;
    state = store.getState();
    expect(selectLoadingState(state)).toBe(false);
  });
});