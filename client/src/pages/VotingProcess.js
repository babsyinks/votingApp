import { useEffect } from "react";
import {
  timerData,
  fetchThenSetCurrentTimerStatus,
} from "features/timer/timerSlice";
import { useSelector, useDispatch } from "react-redux";
import ElectionDetails from "features/election/components/ElectionDetails";
import PreElectionCountDown from "features/timer/components/preElectionTimer/PreElectionCountDown";

function VotingProcess() {
  const dispatch = useDispatch();
  const timer = useSelector(timerData);

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  if (timer.startDate)
    return <PreElectionCountDown endTime={timer.startDate} />;
  else return <ElectionDetails />;
}

export default VotingProcess;
