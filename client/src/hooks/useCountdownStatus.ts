import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timerData } from "features/timer/timerSlice";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";
import type { AppDispatch } from "app/rootReducer";

const useCountdownStatus = (time: number | undefined): boolean => { 
  const [countDownOver, setCountDownOver] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const timer = useSelector(timerData);

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;

    const endCountDown = () => {
      setCountDownOver(true);
      dispatch(updateElectionStatusFromTimer(timer));
      clearInterval(timerInterval);
    };

    const checkTimerStatus = () => {
      if (!time || time <= Date.now()) return;

      const timeSecs = time / 1000;
      timerInterval = setInterval(() => {
        const remainingTimeSecs = timeSecs - Date.now() / 1000;
        if (remainingTimeSecs <= 0) {
          endCountDown();
        }
      }, 1000);
    };

    checkTimerStatus();

    return () => {
      clearInterval(timerInterval);
    };
  }, [time, dispatch, timer]);

  return countDownOver;
};

export default useCountdownStatus;
