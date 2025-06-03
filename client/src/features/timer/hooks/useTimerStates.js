import { useState, useEffect } from "react";
import timerConf from "../config/timerConf";

const useTimerStates = () => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mergedTimerState, setMergedTimerState] = useState([]);

  useEffect(() => {
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
    const mergedConf = timerConf.map((obj, i) => ({
      ...obj,
      value: stateMap[i].value,
      onChange: stateMap[i].onChange,
    }));
    setMergedTimerState(mergedConf);
  }, [startDate, startTime, endDate, endTime]);
  return { mergedTimerState, startDate, startTime, endDate, endTime };
};

export default useTimerStates;
