import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCountdownStatus from "hooks/useCountdownStatus";
import { timerData, fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import ElectionDetails from "features/election/components/ElectionDetails";
import PreElectionCountDown from "features/timer/components/preElectionTimer/PreElectionCountDown";
import type { AppDispatch } from "app/rootReducer";

function VotingProcess() {
  const dispatch = useDispatch<AppDispatch>();
  const timer = useSelector(timerData);
  useCountdownStatus(timer.startDate || Date.now());

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  if (timer.startDate && timer.startDate > Date.now())
    return <PreElectionCountDown endTime={timer.startDate} />;
  else return <ElectionDetails />;
}

export default VotingProcess;
