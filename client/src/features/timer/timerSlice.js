import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};

const fetchThenSetCurrentTimerStatus = createAsyncThunk(
  "timer/fetchThenSetCurrentTimerStatus",
  async () => {
    const { data: timerStatus } = await axios.get(
      // "https://votingapp-pmev.onrender.com/api/v1/timer/status",
      "/api/v1/timer/status",
    );
    return timerStatus;
  },
);

/**
 * timerSlice
 *
 * It handles the setting of timer details. The data for this is the startDate and endDate, indicating
 * when election will start and end respectively. Admin access is needed to set election start and end dates.
 *
 * When the election schedule has not been set, the state is {} (startDate and EndDate are undefined)
 *
 * The startDate and endDate accept timestamps for when election will start and end when the election schedule is set.
 *
 */
const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTimerData(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThenSetCurrentTimerStatus.fulfilled, (state, action) => {
        state.startDate = action.payload.startDate;
        state.endDate = action.payload.endDate;
      })
      .addCase(fetchThenSetCurrentTimerStatus.rejected, (state) => {
        state.startDate = undefined;
        state.endDate = undefined;
      });
  },
});

export const { setTimerData } = timerSlice.actions;

export { fetchThenSetCurrentTimerStatus };

export const timerData = (state) => state.timer;

export default timerSlice.reducer;
