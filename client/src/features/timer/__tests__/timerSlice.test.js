import { configureStore } from "@reduxjs/toolkit";
import timerReducer, {
  setTimerData,
  fetchThenSetCurrentTimerStatus,
  timerData,
} from "../timerSlice";
import axios from "axios";
import { expect, jest, test, describe, beforeEach, afterEach } from "@jest/globals";

jest.mock("axios");

describe("timerSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        timer: timerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return initial state", () => {
    const state = store.getState().timer;
    expect(state).toEqual({});
  });

  test("should handle setTimerData reducer", () => {
    const timer = {
      startDate: "2025-08-08T10:00:00Z",
      endDate: "2025-08-08T18:00:00Z",
    };

    store.dispatch(setTimerData(timer));
    const state = store.getState().timer;

    expect(state).toEqual(timer);
  });

  test("should handle fetchThenSetCurrentTimerStatus fulfilled", async () => {
    const response = {
      startDate: "2025-08-08T09:00:00Z",
      endDate: "2025-08-08T17:00:00Z",
    };

    axios.get.mockResolvedValueOnce({ data: response });

    await store.dispatch(fetchThenSetCurrentTimerStatus());

    const state = timerData(store.getState());
    expect(state).toEqual(response);
    expect(axios.get).toHaveBeenCalledWith("/api/v1/timer/status");
  });

  test("should handle fetchThenSetCurrentTimerStatus rejected", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    await store.dispatch(fetchThenSetCurrentTimerStatus());

    const state = timerData(store.getState());
    expect(state).toEqual({ startDate: undefined, endDate: undefined });
  });
});
