import { useState } from "react";
import timerLabelsWithTypes from "../data/timerLabelsWithTypes";

function useTimerSchedule() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const stateMap = [
    {
      value: startDate,
      onChange: (e) => setStartDate(e.target.value),
    },
    {
      value: startTime,
      onChange: (e) => setStartTime(e.target.value),
    },
    {
      value: endDate,
      onChange: (e) => setEndDate(e.target.value),
    },
    {
      value: endTime,
      onChange: (e) => setEndTime(e.target.value),
    },
  ];

  const mergedTimerState = timerLabelsWithTypes.map((obj, i) => ({
    ...obj,
    value: stateMap[i].value,
    onChange: stateMap[i].onChange,
  }));

  return { mergedTimerState, startDate, startTime, endDate, endTime };
}

export default useTimerSchedule;
