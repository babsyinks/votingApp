import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "app/rootReducer";

export interface TimerState {
  startDate?: number;
  endDate?: number;
}

const initialState: TimerState = {};

export const fetchThenSetCurrentTimerStatus = createAsyncThunk<TimerState>(
  "timer/fetchThenSetCurrentTimerStatus",
  async () => {
    const { data } = await axios.get<TimerState>("/api/v1/timer/status");
    return data;
  },
);

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTimerData: (
      state,
      action: PayloadAction<TimerState>,
    ) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchThenSetCurrentTimerStatus.fulfilled,
        (state, action: PayloadAction<TimerState>) => {
          state.startDate = action.payload.startDate;
          state.endDate = action.payload.endDate;
        },
      )
      .addCase(fetchThenSetCurrentTimerStatus.rejected, (state) => {
        state.startDate = undefined;
        state.endDate = undefined;
      });
  },
});

export const { setTimerData } = timerSlice.actions;

export const timerData = (state: Pick<RootState, "timer">) => state.timer;

export default timerSlice.reducer;
