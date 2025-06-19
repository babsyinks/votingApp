import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timerData } from "features/timer/timerSlice";
import { updateElectionStatusFromTimer } from "features/election/electionSlice";

const useCountdownStatus = (time) => {
  const [countDownOver, setCountDownOver] = useState(false);
  const dispatch = useDispatch();
  const timer = useSelector(timerData);

  useEffect(() => {
    let timerInterval;

    const endCountDown = () => {
      setCountDownOver(true);
      dispatch(updateElectionStatusFromTimer(timer));
      clearInterval(timerInterval);
    };

    const checkTimerStatus = async () => {
      if (time <= Date.now()) return;
      const timeSecs = time / 1000;
      timerInterval = setInterval(() => {
        const remainingTimeSecs = timeSecs - Date.now() / 1000;
        const timerStatus = async () => {
          if (remainingTimeSecs <= 0) {
            endCountDown();
          }
        };
        timerStatus();
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
