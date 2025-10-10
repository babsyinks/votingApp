import { configureStore } from "@reduxjs/toolkit";
import timerReducer, {
  setTimerData,
  fetchThenSetCurrentTimerStatus,
  timerData,
} from "../timerSlice";
import axios from "axios";
import {
  expect,
  jest,
  test,
  describe,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { RootState, AppDispatch } from "app/rootReducer";

jest.mock("axios");

describe("timerSlice", () => {
  let store: ReturnType<typeof configureStore>;
  let getState: () => RootState;
  let dispatch: AppDispatch;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        timer: timerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    });
    getState = () => store.getState() as RootState;
    dispatch = store.dispatch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return initial state", () => {
    const state = getState().timer;
    expect(state).toEqual({});
  });

  test("should handle setTimerData reducer", () => {
    const timer = {
      startDate: 1754647200000,
      endDate: 1754676000000,
    };

    dispatch(setTimerData(timer));
    const state = getState().timer;

    expect(state).toEqual(timer);
  });

  test("should handle fetchThenSetCurrentTimerStatus fulfilled", async () => {
    const response = {
      startDate: 1754643600000,
      endDate: 1754672400000,
    };

    mockedAxios.get.mockResolvedValueOnce({ data: response });

    await dispatch(fetchThenSetCurrentTimerStatus());

    const state = timerData(getState());
    expect(state).toEqual(response);
    expect(axios.get).toHaveBeenCalledWith("/api/v1/timer/status");
  });

  test("should handle fetchThenSetCurrentTimerStatus rejected", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    await dispatch(fetchThenSetCurrentTimerStatus());

    const state = timerData(getState());
    expect(state).toEqual({ startDate: undefined, endDate: undefined });
  });
});
