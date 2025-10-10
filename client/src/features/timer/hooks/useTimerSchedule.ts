import { useState, ChangeEvent } from "react";
import timerLabelsWithTypes from "../data/timerLabelsWithTypes";
import type { BaseInputProps } from "components/ui/BaseInput";

type TimerLabelWithType = {
  label: string;
  type: BaseInputProps["type"];
};

type StateMapEntry = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function useTimerSchedule() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const stateMap: StateMapEntry[] = [
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

  const mergedTimerState = timerLabelsWithTypes.map(
    (obj: TimerLabelWithType, i: number) => ({
      ...obj,
      value: stateMap[i].value,
      onChange: stateMap[i].onChange,
    })
  );

  return { mergedTimerState, startDate, startTime, endDate, endTime };
}

export default useTimerSchedule;
